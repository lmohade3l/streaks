import { useEffect, useState } from "react";
import { load, save } from "./store.v2";
import { PersistedState } from "./types";

export default function useHabits() {
    const [state, setState] = useState<PersistedState | null>(null)

    // on mount, read from load()
    useEffect(() => {
        const savedState = load()
        setState(savedState)
    }, [])

    // on change, save() to local storage
    useEffect(() => {
        if (state) save(state)
    }, [state])

}