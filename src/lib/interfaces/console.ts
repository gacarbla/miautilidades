export interface logRulesSchema {
    error?: boolean
    executionError?: boolean
    loadError?: boolean
    permissionsError?: boolean
    botPermissionsError?: boolean
    userPermissionsError?: boolean
    unknownError?: boolean

    startLog?: boolean
    startError?: boolean

    eventListenerBuildLog?: boolean
    eventListenerBuildError?: boolean
    eventListenerExecutionLog?: boolean
    eventListenerExecutionError?: boolean

    preconditionBuildLog?: boolean
    preconditionBuildError?: boolean
    preconditionExecutionLog?:boolean
    preconditionExecutionError?:boolean
    preconditionTestLog?: boolean
    preconditionTestError?: boolean

    commandBuildLog?: boolean
    commandBuildError?: boolean
    commandBuildWarn?: boolean
    commandPreconditionsBuildLog?: boolean
    commandPreconditionsBuildError?: boolean
    commandExecutionLog?: boolean
    commandExecutionError?: boolean
    commandPreconditionsLog?: boolean
    commandPreconditionsError?: boolean

    interactionBuildLog?: boolean
    interactionBuildError?: boolean
    interactionBuildWarn?: boolean
    interactionPreconditionsBuildLog?: boolean
    interactionPreconditionsBuildError?: boolean
    interactionExecutionLog?: boolean
    interactionExecutionError?: boolean
    interactionPreconditionsLog?: boolean
    interactionPreconditionsError?: boolean

    modalBuildLog?: boolean
    modalBuildError?: boolean
    modalPreconditionsBuildLog?: boolean
    modalPreconditionsBuildError?:boolean
    modalExecutionLog?: boolean
    modalExecutionError?: boolean
    modalPreconditionsLog?: boolean
    modalPreconditionsError?: boolean

    buttonBuildLog?: boolean
    buttonBuildError?: boolean
    buttonPreconditionsBuildLog?: boolean
    buttonPreconditionsBuildError?: boolean
    buttonExecutionLog?: boolean
    buttonExecutionError?: boolean
    buttonPreconditionsLog?: boolean
    buttonPreconditionsError?: boolean

    messageReadedLog?: boolean
    messageReadedError?: boolean
    messageCommandLog?: boolean
    messageCommandError?: boolean
}

export interface ColorSchema {
    normal: string,
    error: string,
    warning: string,
    info: string,
    success: string,
    test: string,
    reset: string,
}