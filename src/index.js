import {
    ScriptureParaModel,
    ScriptureParaModelQuery,
} from "proskomma-render";
import MainDocSet from './MainDocSet';
import MainDocument from './MainDocument';

const doRender = async (pk, config, docSetIds, documentIds) => {
    const doMainRender = (config, result) => {
        const dModel = new MainDocument(result, {}, config);
        const dsModel = new MainDocSet(result, {}, config);
        dsModel.addDocumentModel('default', dModel);
        const model = new ScriptureParaModel(result, config);
        model.addDocSetModel('default', dsModel);
        model.render();
        return model.config;
    }
    const thenFunction = result => {
        return doMainRender(config, result);

    }
    const result = await ScriptureParaModelQuery(pk, docSetIds || [], documentIds || []);
    return thenFunction(result);
};

export {
    doRender,
    MainDocSet as JsonMainDocSet,
    MainDocument as JsonMainDocument,
}
