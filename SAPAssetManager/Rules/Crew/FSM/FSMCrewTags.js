
export default function FSMCrewTags(context) {
    let tags = [];
    
    if (context.binding.MinimumSize) {
        tags.push({
            'Text': `$(L,minimum_people_per_crew_x,${context.binding.MinimumSize})`,
        });
    }

    if (context.binding.MinimumCapacity) {
        tags.push({
            'Text': `$(L,minimum_capacity_per_crew_x,${context.binding.MinimumCapacity})`,
        });
    }

    return tags;
}
