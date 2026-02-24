import libForm from '../Common/Library/FormatLibrary';
import chartType from './ChartType';

export default function AnalyticsSeriesTitles(context, binding = context.binding) {
	if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
		binding = binding.PRTPoint || {};
	}
	
	let legend = '';
	if (chartType(context) === 'valCode') {
		return legend;
	}
	if (binding.MeasurementDocs?.length) {
		return [libForm.formatDetailHeaderDisplayValue(context, binding.Point, context.localizeText('point'))];
	} else {
		return legend;
	}
}
