import Logger from '../../../Log/Logger';
export default function WHInboundDeliveryItemDetailsOnReturning(context, binding = context.getPageProxy?.().binding || context.binding) {
  const pageProxy = context.getPageProxy?.() || context;
  const sectionedTable = pageProxy.getControl('SectionedTable');
  try {
    const sections = sectionedTable?.getSections?.() || [];
    const objectHeaderSection = sectionedTable?.getSection?.('ObjectHeaderSectionTable')
      || sections.find(sec => sec._name === 'ObjectHeaderSectionTable' || sec._Name === 'ObjectHeaderSectionTable');

    if (objectHeaderSection) {
      if (binding) {
        objectHeaderSection.redraw?.(true);
      } else {
        objectHeaderSection.redraw?.();
      }
    }
  } catch (e) {
    Logger.error(e);
  }
}
