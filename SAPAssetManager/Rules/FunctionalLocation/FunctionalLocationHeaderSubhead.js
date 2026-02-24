import FormatCategory from './FormatCategory';

export default async function FunctionalLocationHeaderSubhead(context) {
    const subhead = await FormatCategory(context);

    return `${subhead && subhead !== '-' ? subhead : ''}`;
}
