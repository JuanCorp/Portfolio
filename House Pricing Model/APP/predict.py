import json
import xgboost as xgb
import numpy as np
import os
path = os.path.dirname(os.path.abspath(__file__)) + "/"
import iml
import pandas as pd

def prepare_range(contribs):
    predictions = list()
    contribs = contribs[:-1]
    contribs = np.abs(contribs)
    contribs = np.sort(contribs)
    top_20_percent = len(contribs) // 5
    if len(contribs) > 10:
        contribs = contribs[-top_20_percent:]
    for i in range(len(contribs)):
        new_price_array = np.concatenate((contribs[:i],contribs[i+1:]))
        new_price = new_price_array.sum()
        predictions.append(new_price)
    error = np.array(predictions).std()
    print(error)
    return error

def get_top_reasons(values,names):
    values_df = pd.DataFrame({"shap":values,
                              "col":names})
    values_df["sign"] = values_df["shap"] >= 0
    values_df["abs"] = np.abs(values_df["shap"])
    values_df = values_df.sort_values(by="abs",ascending=False).head()
    explanation_text = [{"col":row["col"],"sign":row["sign"]} for row in values_df.to_dict(orient='records')]
    return explanation_text

def _explicar_instancia(shap_values, feature_names=None, data=None, out_names=["Precio"]):
    if type(data) == np.ndarray:
        data = data.flatten()

    nans = np.argwhere(np.isnan(shap_values))
    indexes = nans[:, 1]
    shap_values = shap_values[:, ~np.isnan(shap_values).all(0)]
    shap_values = shap_values[~np.isnan(shap_values).all(1)]
    feature_names = [f for i, f in enumerate(feature_names) if i not in indexes]
    data = np.array([d for i, d in enumerate(data) if i not in indexes])
    instance = iml.Instance(np.zeros((1, len(feature_names))), data)
    exp = iml.AdditiveExplanation(
        shap_values[0, -1],
        np.sum(shap_values[0, :]),
        shap_values[0, :-1],
        None,
        instance,
        iml.IdentityLink(),
        iml.Model(None, out_names),
        iml.DenseData(np.zeros((1, len(feature_names))), feature_names),
    )
    visualizer = iml.AdditiveForceVisualizer(exp)
    visualizer.data["labelMargin"] = 20
    explanation_text = get_top_reasons(shap_values[0,:-1],feature_names)
    print(visualizer.data)
    return visualizer.data,explanation_text

def predict_price(data,sector):
    model_type = ''
    if 'casas' in data.columns:
        model_type = 'casas'
    else:
        model_type = 'apartamentos'
    model = xgb.Booster({'nthread':-1})
    model.load_model(path + 'static/house_model_{}.model'.format(model_type))
    column_set = set(list(data.columns))
    with open(path + 'static/model_features_{}.json'.format(model_type),'r') as mf:
        model_features = json.load(mf)
        model.feature_names = model_features["Feature"]
        model.feature_types = model_features["Type"]
        for feature in model_features["Feature"]:
            if feature not in column_set:
                if "Distancia " in feature:
                    data[feature] = 100
                else:
                    data[feature] = 0
        if sector not in model_features["Feature"]:
                data["Otro"] = 1
                data.drop(sector,axis=1,inplace=True)

    data = data[model_features["Feature"]]
    predict_data = xgb.DMatrix(data)
    pred_price = model.predict(predict_data,pred_contribs=True)
    explicacion_dict,explanation_text = _explicar_instancia(shap_values=pred_price,feature_names=model.feature_names,
                                           data=data[model.feature_names].values)
    print(explicacion_dict)
    error = prepare_range(pred_price[pred_price!=0])
    low = np.expm1(pred_price.sum() - error)
    high = np.expm1(pred_price.sum() + error)
    alq_low,alq_high = predict_alquiler(data,pred_price.sum())
    return low,high,alq_low,alq_high,explicacion_dict,explanation_text


def predict_alquiler(data,precio):
    model = xgb.Booster({'nthread': -1})
    model.load_model(path + 'static/house_model_alquiler.model')
    with open(path + 'static/model_features_alquiler.json', 'r') as mf:
        model_features = json.load(mf)
        model.feature_names = model_features["Feature"]
        model.feature_types = model_features["Type"]


    model_data = data.copy()
    model_data['Precio'] = precio
    model_data = model_data[model_features["Feature"]]
    predict_data = xgb.DMatrix(model_data)
    pred_alq_price = model.predict(predict_data, pred_contribs=True)
    error = prepare_range(pred_alq_price[pred_alq_price != 0])
    low = np.expm1(pred_alq_price.sum() - error) / 3
    high = np.expm1(pred_alq_price.sum() + error) / 3
    return low,high



