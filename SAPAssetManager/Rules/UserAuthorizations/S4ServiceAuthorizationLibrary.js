import CommonLibrary from '../Common/Library/CommonLibrary';

export default class S4ServiceAuthorizationLibrary {

	static isServiceOrderCreateEnabled(clientAPI) {
		return CommonLibrary.isAppParameterEnabled(clientAPI, 'USER_AUTHORIZATIONS', 'Enable.SO.Create');
	}

	static isServiceOrderEditEnabled(clientAPI) {
		return CommonLibrary.isAppParameterEnabled(clientAPI, 'USER_AUTHORIZATIONS', 'Enable.SO.Edit');
	}

	static isServiceRequestCreateEnabled(clientAPI) {
		return CommonLibrary.isAppParameterEnabled(clientAPI, 'USER_AUTHORIZATIONS', 'Enable.SR.Create');
	}

	static isServiceRequestEditEnabled(clientAPI) {
		return CommonLibrary.isAppParameterEnabled(clientAPI, 'USER_AUTHORIZATIONS', 'Enable.SR.Edit');
	}
	
	static isServiceQuotationCreateEnabled(clientAPI) {
		return CommonLibrary.isAppParameterEnabled(clientAPI, 'USER_AUTHORIZATIONS', 'Enable.SQ.Create');
	}

	static isServiceQuotationEditEnabled(clientAPI) {
		return CommonLibrary.isAppParameterEnabled(clientAPI, 'USER_AUTHORIZATIONS', 'Enable.SQ.Edit');
	}

	static isServiceConfirmationCreateEnabled(clientAPI) {
		return CommonLibrary.isAppParameterEnabled(clientAPI, 'USER_AUTHORIZATIONS', 'Enable.SC.Create');
	}

	static isServiceConfirmationEditEnabled(clientAPI) {
		return CommonLibrary.isAppParameterEnabled(clientAPI, 'USER_AUTHORIZATIONS', 'Enable.SC.Edit');
	}
}
