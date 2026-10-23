export type HABIT_FREQUNECY = 'daily' | 'weekdays'

export type HABIT = {
    name: string,
    logs: Record<string , number>[],
    id: string,
    target: number,
    frequency: HABIT_FREQUNECY
}

export type State = {
    habite: HABIT[],
    version: string,
}