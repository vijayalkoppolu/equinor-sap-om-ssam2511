/**
* Describe this function...
* @param {context} context
*/
import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';
export default function OverviewTabPageUpdate(context, page, filterAction, extendedEntityTypeName, sectionLabel) {
    if (page) {
        let controls = page.Controls.find(c => c._Type === 'Control.Type.SectionedTable');
        if (controls && controls.Sections) {
            let header = controls.Sections.find(s => s._Type === 'Section.Type.ObjectTable').Header;
            if (header) {
                addFilter(header, filterAction);
                addLabel(header, sectionLabel);
            }
        }
        // add 'tab' to the page name to avoid conflicts with other pages
        page._Name = page._Name + '_tab';
        return ModifyListViewTableDescriptionField(context, page, extendedEntityTypeName);
    }
}

function addFilter(header, filterAction) {
    if (filterAction) {
        // add filter in section header
        let filterButton = {
            '_Type': 'SectionHeaderItem.Type.Button',
            '_Name': 'FilterButton',
            'ButtonType': 'Text',
            'Title': '$(L, filter)',
            'Position': 'Right',
            'OnPress': filterAction,
        };

        if (header.Items) {
            header.Items.push(...[filterButton]);
        } else {
            header.Items = [filterButton];
        }
    }
}

function addLabel(header, sectionLabel) {
    if (sectionLabel) {
        // add section label in section header
        let label = {
            '_Type': 'SectionHeaderItem.Type.Label',
			'_Name': 'label',
			'Title': sectionLabel,
        };

        if (header.Items) {
            header.Items.push(...[label]);
        } else {
            header.Items = [label];
        }
    }
}
