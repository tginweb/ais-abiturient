export default async function getStepsFetched() {

    if (this.stepsFetched) return this.stepsFetched;

    // const currentStep = this.getCurrentStep();
    let stepsByCode = this.getStepsInfoByCode()
    let steps = this.getStepsInfo();
    let fetchedSteps = {}
    let prevErrors = false

    for (const step of steps) {
        let stepCode = step.code

        const fetchedStep = {
            code: step.code,
            title: step.title,
            index: step.index,
            next: step.next,
            fields: step.fields,
            done: false,
            doneErrors: [],
            access: false,
            accessErrors: [],
            prevHasErrors: false,
            enable: true
        }

        if (step.done) {
            let doneErrors = [];
            fetchedStep.done = await step.done(doneErrors, fetchedSteps);
            fetchedStep.doneErrors = doneErrors
        }

        if (step.access) {
            let accessErrors = [];
            fetchedStep.access = step.access(accessErrors, fetchedSteps);
            fetchedStep.accessErrors = accessErrors
        }

        if (step.enable) {
            fetchedStep.enable = step.enable(fetchedSteps);
        }

        fetchedStep.prevHasErrors = prevErrors

        if (!step.done) {
            prevErrors = true
        }

        fetchedSteps[stepCode] = fetchedStep
    }

    this.stepsFetched = Object.values(fetchedSteps)

    return this.stepsFetched
}

