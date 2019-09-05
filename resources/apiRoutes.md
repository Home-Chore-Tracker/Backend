Families {
    id
    name 
    Children{}
    Chores{}
}

Children{
    family_id
    Chores{}
    child1{}
    child2{}
    child3{}
}

child#{
    id
    name
    family_id
    Chores{}
}

Chores {
    chore1{}
    chore2{}
    chore3{}
    chore4{}
}

chore#{
    id
    name
    duedate
    completed
    children_assigned_to {
        child1{}
        child2{}
}

user{
    id
    name
    family_id
}