export type HabitFrequency = 'daily' | 'weekdays'

export type Habit = {
    name: string,
    logs: Record<string , number>,
    id: string,
    target: number,
    frequency: HabitFrequency
}

export type AppState = {
    habits: Habit[],
    version: number,
}