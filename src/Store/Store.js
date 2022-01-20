import {types} from "mobx-state-tree"

const User = types.model({
    id: types.optional(types.string,""),
    name: types.optional(types.string, ""),
    email: types.optional(types.string, ""),
    password: types.optional(types.string, ""),
})

const Todo = types.model({
    id: types.optional(types.string, ""),
    title: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
    startDate: types.optional(types.string, ""),
    dueDate: types.optional(types.string, ""),
    createdDate: types.optional(types.string, ""),
    updatedDate: types.optional(types.string, ""),
    status: types.optional(types.boolean, false),
})