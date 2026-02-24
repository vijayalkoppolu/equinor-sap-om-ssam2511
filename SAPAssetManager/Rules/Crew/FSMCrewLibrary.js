import ODataDate from '../Common/Date/ODataDate';
import CommonLibrary from '../Common/Library/CommonLibrary';
import QueryBuilder from '../Common/Query/QueryBuilder';
import Logger from '../Log/Logger';
import GetSAPUserId from '../MobileStatus/GetSAPUserId';
import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default class FSMCrewLibrary {

    static isFSMCrewFeatureEnabled(context) {
        return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/FSMCrew.global').getValue());
    }

    static async getFSMCrewQuery(context) {
        const fsmCrewType = context.getGlobalDefinition('/SAPAssetManager/Globals/Crew/FSMCrewType.global').getValue();
        let query = `ListType eq '${fsmCrewType}'`;

        const userBusinessPartnerID = await this.getUserBusinessPartnerId(context) || '';
        query += ` and CrewListItems/any(item:item/BusinessPartner eq '${userBusinessPartnerID}')`;
   
        return query;
    }

    static getNonFSMCrewActivitiesFilter() {
        return "(CrewID eq '' or CrewID eq null)";
    }

    static getFSMCrewItemDateQuery(date = new Date()) {
        let lowerBound;
        let upperBound;
        
        if (date.lowerBound && date.upperBound) {
            let odataDate = new ODataDate(date.lowerBound);
            lowerBound = odataDate.toLocalDateTimeString();

            odataDate = new ODataDate(date.upperBound);
            upperBound = odataDate.toLocalDateTimeString();

            if (upperBound === lowerBound) { // today
                return `(StartTimestamp le datetime'${lowerBound}' and EndTimestamp gt datetime'${lowerBound}')`;
            }
        } else {
            let dateWithoutTime = new Date(date.setHours(0,0,0,0));
            let odataDate = new ODataDate(dateWithoutTime);
            lowerBound = odataDate.toLocalDateTimeString();

            odataDate = new ODataDate(dateWithoutTime.setDate(dateWithoutTime.getDate() + 1));
            upperBound = odataDate.toLocalDateTimeString();
        }
       
        return `(StartTimestamp lt datetime'${upperBound}' and EndTimestamp gt datetime'${lowerBound}')`;
    }

    static getQueryWithExcludedFSMCrew(context, isCrewItem) {
        const fsmCrewType = context.getGlobalDefinition('/SAPAssetManager/Globals/Crew/FSMCrewType.global').getValue();

        if (isCrewItem) {
            return `not(CrewList/ListType eq '${fsmCrewType}')`;
        }
        return `not(ListType eq '${fsmCrewType}')`;

    }

    static async getCrewUserByFSMCrew(context, crewID) {
        if (!crewID) return Promise.resolve(null);
        
        const userBusinessPartnerID = await this.getUserBusinessPartnerId(context);
        if (!userBusinessPartnerID) return Promise.resolve(null);

        const queryOptions = new QueryBuilder();
        queryOptions.addFilter(`CrewId eq '${crewID}'`);
        queryOptions.addFilter("CrewItemType eq 'BP'");
        queryOptions.addFilter(`BusinessPartner eq '${userBusinessPartnerID}'`);
        queryOptions.addFilter(this.getFSMCrewItemDateQuery());

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'CrewListItems', [], queryOptions.build())
            .then(result => result.length ? result.getItem(0) : null)
            .catch(error => {
                Logger.error('getCrewUserByFSMCrew', error);
                return null;
            });
    }

    static async getFSMCrewByUserAndDates(context, dates) {
        const userBusinessPartnerID = await this.getUserBusinessPartnerId(context);
        if (!userBusinessPartnerID) return Promise.resolve(null);
        
        const queryOptions = new QueryBuilder();
        queryOptions.addFilter("CrewItemType eq 'BP'");
        queryOptions.addFilter(`BusinessPartner eq '${userBusinessPartnerID}'`);
        queryOptions.addFilter(this.getFSMCrewItemDateQuery(dates));
        queryOptions.addExpandStatement('CrewList');

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'CrewListItems', [], queryOptions.build())
            .then(result => {
                let crew = {};

                if (result.length) {
                    for (const crewItem of result) {
                        crew[crewItem.CrewId] = crew[crewItem.CrewId] || {
                            name: crewItem.CrewList.Name || crewItem.CrewId,
                            type: crewItem.TechnicianType,
                            startDate: crewItem.StartTimestamp,
                            endDate: crewItem.EndTimestamp,
                        };
                    }
                }
                
                return Object.keys(crew).length ? crew : null;
            })
            .catch(error => {
                Logger.error('getFSMCrewByUserAndDates', error);
                return null;
            });
    }

    static async getUserBusinessPartnerId(context) {
        const currentUserName = GetSAPUserId(context);
        if (!currentUserName) return Promise.resolve('');
        
        let userBusinessPartnerID = CommonLibrary.getStateVariable(context, 'UserBusinessPartnerID');
        if (!userBusinessPartnerID) {
            userBusinessPartnerID = await context.read('/SAPAssetManager/Services/AssetManager.service', 'S4BusinessPartners', [], `$filter=UserName eq '${currentUserName}'`).then(result => result.length ? result.getItem(0).BPNum : null);
            if (!userBusinessPartnerID) return Promise.resolve(null);
            CommonLibrary.setStateVariable(context, 'UserBusinessPartnerID', userBusinessPartnerID);
        }

        return Promise.resolve(userBusinessPartnerID);
    }

    static isCrewMemberLeader(context, crewUser) {
        const LeaderType = 'LEADER';
        return crewUser ? crewUser.TechnicianType === LeaderType : context.binding?.CrewMemberType === LeaderType;
    }
} 
