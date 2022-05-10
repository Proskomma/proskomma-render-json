import {ScriptureDocSet} from 'proskomma-render';

export default class MainDocSet extends ScriptureDocSet {

    constructor(result, context, config) {
        super(result, context, config);
        this.appData = {};
        this.addActions();
    }

    addActions() {
        this.addAction(
            'startDocSet',
            () => true,
            renderer => {
                const docSetContext = renderer.context.docSet;
                renderer.config.output.docSets[docSetContext.id] = {
                    selectors: docSetContext.selectors,
                    tags: docSetContext.tags,
                    documents: {},
                };
                renderer.appData.currentDocSetId = renderer.context.docSet.id;
            },
        )
        this.addAction(
            'endDocSet',
            () => true,
            renderer => {
                renderer.appData.currentDocSet = null;
            },
        )
    }

}
