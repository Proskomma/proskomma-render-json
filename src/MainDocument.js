import {ScriptureParaDocument} from 'proskomma-render';

export default class MainDocument extends ScriptureParaDocument {

    constructor(result, context, config) {
        super(result, context, config);
        this.inSelectedSequence = false;
        this.addActions();
    }

    addActions() {
        this.addAction(
            'startDocument',
            () => true,
            (renderer, context) => {
                renderer.config.output
                    .docSets[renderer.docSetModel.appData.currentDocSetId]
                    .documents[context.document.headers.bookCode] = {
                    headers: context.document.headers,
                    tags: context.document.tags,
                    sequences: {},
                };
                renderer.docSetModel.appData.currentBookCode = context.document.headers.bookCode;
                renderer.docSetModel.appData.currentDocumentId = context.document.id;
            },
            true,
        );
        this.addAction(
            'endDocument',
            () => true,
            (renderer, context) => {
                renderer.config.output
                    .docSets[renderer.docSetModel.appData.currentDocSetId]
                    .documents[context.document.headers.bookCode].mainSequence =
                    Object.entries(renderer.config.output
                    .docSets[renderer.docSetModel.appData.currentDocSetId]
                    .documents[context.document.headers.bookCode]
                    .sequences).filter(kv => kv[1].type === 'main')[0][0];
                renderer.docSetModel.appData.currentBookCode = null;
                renderer.docSetModel.appData.currentDocumentId = null;
            },
            true,
        );
        this.addAction(
            'startSequence',
            () => true,
            (renderer, context, data) => {
                renderer.inSelectedSequence =
                    (!renderer.config.selectedSequenceId && context.sequenceStack[0].type === 'main') ||
                    (renderer.config.selectedSequenceId === context.sequenceStack[0].id);
                const document = renderer.config.output
                    .docSets[renderer.docSetModel.appData.currentDocSetId]
                    .documents[context.document.headers.bookCode];
                console.log(data.blocks[0]);
                document.sequences[context.sequenceStack[0].id] =
                    {
                        type: context.sequenceStack[0].type,
                        nBlocks: context.sequenceStack[0].nBlocks,
                        firstBlockScope: "",
                        previewText: "",
                        selected: renderer.inSelectedSequence,
                    };
                renderer.docSetModel.appData.currentSequence = context.sequenceStack[0].id;
                renderer.inSelectedSequence =
                    (!renderer.config.selectedSequenceId && context.sequenceStack[0].type === 'main') ||
                    (renderer.config.selectedSequenceId === context.sequenceStack[0].id);
            },
            true,
        );
        this.addAction(
            'endSequence',
            () => true,
            (renderer, context) => {
                renderer.docSetModel.appData.currentSequence = null;
                renderer.inSelectedSequence = false;
            },
            true,
        );
        this.addAction(
            'blockGraft',
            () => true,
            (renderer, context, data) => {
                renderer.renderSequenceId(data.payload);
            },
            true,
        );
        this.addAction(
            'inlineGraft',
            () => true,
            (renderer, context, data) => {
                renderer.renderSequenceId(data.payload);
            },
            true,
        );
    };
}
