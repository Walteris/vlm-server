var db = require('../utils/dbconnection'); //reference of dbconnection.js
// var vlms=require('./surveyhelpers'); //reference of dbconnection.js
// var srv=require('./surveyobjects'); //reference of dbconnection.js
const VLM_TXT_SEP = "®©";

var VLMSurveyObject = Object.freeze({
    Survey: "survey",
    Area: "subject area",
    Group: "group",
    Question: "question",
    Answer: "answer"
});

var VLMSurveyAttribute = Object.freeze({
    Header: "header",
    Body: "body",
    Footer: "footer",
    HelpText: "helptext",
    TipAlwaysOn: "tip_alwayson",
    TipOnDemand: "tip_on_demand"
});

var Survey2 = {

    getSurveyById: function (id, callback) {

        var sql;

        sql =
            "select S.T0049_ID, SS.T0005_Hierarchy, TR.T0004_Config_Order, AD.T0006_ID, AD.T0006_Desc, SS.T0008_ID as objectID, A.T008_Desc , AP.T0008_Parent_ID, A.T0009_ID, D.T0009_Desc, " +
            "A.T0003_ID, OT.T0003_Desc as texttype, AT.T0004_ID, TR.T0004_Desc as objtype, L.T0018_ID, L.T0018_Desc as Language , AT.T0012_ID, T.T0012_Text as valuetext, T.T0012_Display_Cfg as displaycfg, T.T0012_Control_Cfg, " +
            "AT.T0019_ID as autoID, CR.T0017_AutoID, CR.T0007_Cust_Resp custResp, CA.T0061_AutoID, U.T0002_ID User_ID, U.T0002_User_SurName, U.T0002_User_FirstName, UE.T0023_Email " +
            "from t0049_surveys S " +
            "join j0005_1_8_survey_structure SS on SS.T0001_ID  = S.T0001_ID " +
            "join  t0008_assets A on A.T0008_ID= SS.T0008_ID " +
            "join c0003_objects_types OT on OT.T0003_ID = A.T0003_ID " +
            "join c0006_assets_it_def_types AD on AD.T0006_ID = A.T0006_ID " +
            "left join c0009_assets_bus_fct_domains D on D.T0009_ID = A.T0009_ID " +
            "join j0019_8_12_assets_to_ml_text AT on AT.T0008_ID= SS.T0008_ID " +
            "join c0004_text_roles TR on TR.T0004_ID = AT.T0004_ID " +
            "join l0012_text T on T.T0012_ID  = AT.T0012_ID " +
            "join c0018_languages L on L.t0018_id= AT.T0018_ID " +
            "left join j0061_1_2_cust_assignment CA on CA.Question_ID = A.T0008_ID and CA.Survey_ID = S.T0049_ID " +
            "left join j0059_8_8_assets AP on AP.T0008_ID = A.T0008_ID " +
            "left join j0017_1_2_cust_responses CR on CR.T0008_ID = A.T0008_ID " +
            "left join t0002_ext_users U on U.T0002_ID = CA.User_ID " +
            "left join t0023_users_emails UE on UE.T0002_ID = U.T0002_ID " +
            "left join t0008_assets AA on AA.T0008_ID = AP.T0008_Parent_ID  " +
            "where S.T0049_ID=? " +
            "order by  SS.T0005_Hierarchy";

        return db.query(sql, [id], function (err, rows) {
            if (err) {
                callback(err, rows);
            } else {
                callback(err, this.toSurvey( rows));
            }
        }.bind(this));
        // return db.query(sql,[id],callback);
    },

    toSurvey: function (rows) {

        var currentArea = null;
        var currentGroup = null;
        var currentAnswer = null;
        var currentQuestion = null;
        var currentSurvey = null;

        var surveyObjectType;
        rows.forEach(function (row) {
            surveyObjectType = String(row.texttype).toLowerCase();
            // this is a hack, answer objects have position and number in its name, should be just 'answer'
            if (surveyObjectType.indexOf('ans') == 0) {
                surveyObjectType = VLMSurveyObject.Answer;
            }
            switch (surveyObjectType) {
                case VLMSurveyObject.Survey: {
                    currentSurvey = this.toSurveyObject(row, currentSurvey);
                    break;
                }
                case VLMSurveyObject.Area: {
                    if (!currentArea || (currentArea.id != row.objectID)) {
                        currentArea = this.toSurveyAreaObject(row, currentSurvey, null);
                    } else {
                        currentArea = this.toSurveyAreaObject(row, currentSurvey, currentArea);
                    }
                    break;
                }
                case VLMSurveyObject.Group: {
                    if (!currentArea) {
                        currentArea = this.toSurveyAreaObject(null, currentSurvey, null);
                    }
                    if (!currentGroup || (currentGroup.id != row.objectID)) {
                        currentGroup = this.toSurveyGroupObject(row, currentArea, null);
                    } else {
                        currentGroup = this.toSurveyGroupObject(row, currentArea, currentGroup);
                    }
                    break;
                }
                case VLMSurveyObject.Question: {
                    if (!currentArea) {
                        currentArea = this.toSurveyAreaObject(null, currentSurvey, null);
                    }
                    if (!currentGroup) {
                        currentGroup = this.toSurveyGroupObject(null, currentArea, null);
                    }
                    if (!currentQuestion || (currentQuestion.id != row.objectID)) {
                        currentQuestion = this.toSurveyQuestionObject(row, currentArea, currentGroup, null);
                    } else {
                        currentQuestion = this.toSurveyQuestionObject(row, currentArea, currentGroup, currentQuestion);
                    }
                    break;
                }
                case VLMSurveyObject.Answer: {
                    // check if we had already some question, we cannot generate question to answer automatically
                    // like we can do for area or group
                    if (!currentQuestion) {
                        console.log('Survey definition error: Question do not exists for answer !', row);
                        break;
                    }
                    if (!currentAnswer || (currentAnswer.id != row.objectID)) {
                        //currentAnswer = this.addAnswer(currentQuestion, row);
                        currentAnswer = this.toSurveyAnswerObject(row, currentQuestion, null);
                    } else {
                        currentAnswer = this.toSurveyAnswerObject(row, currentQuestion, currentAnswer);
                    }
                    break;
                }
                default: {
                    console.log('Survey definition error: Invalid object type !', row);
                    break;
                }
            }
        }.bind(this))
        return currentSurvey;
    },

    getSurveyBaseObject: function () {
        return {
            id: null,
            header: null,
            body: null,
            footer: null,
            helpText: null,
            tipOnDemand: null,
            tipAlwaysOn: null
        }
    },

    toSurveyObject: function (row, surveyObject) {
        if (!surveyObject) {
            // spread the base object
            surveyObject = this.getSurveyBaseObject();
            surveyObject.title = '';
            surveyObject.areas = [];
        }
        this.toSurveyBaseObject(row, surveyObject);
        surveyObject.id = row.T0049_ID;
        return surveyObject;
    },
    toSurveyBaseObject: function (row, surveyBaseObject) {

        if (!surveyBaseObject) {
            console.log("Base object undefined: ", row);
            return surveyBaseObject;
        }
        if (row) {
            if (surveyBaseObject.id == null) {
                surveyBaseObject.id = row.objectID;
            }
            var objType = String(row.objtype).toLowerCase();
            switch (objType) {
                case VLMSurveyAttribute.Header: {
                    surveyBaseObject.header = this.toSurveyTextObject(row, surveyBaseObject.header);
                    break;
                }
                case VLMSurveyAttribute.Body: {
                    surveyBaseObject.body = this.toSurveyTextObject(row, surveyBaseObject.body);
                    break;
                }
                case VLMSurveyAttribute.Footer: {
                    surveyBaseObject.footer = this.toSurveyTextObject(row, surveyBaseObject.footer);
                    break;
                }
                case VLMSurveyAttribute.HelpText: {
                    surveyBaseObject.helpText = this.toSurveyTextObject(row, surveyBaseObject.helpText);
                    break;
                }
                case VLMSurveyAttribute.TipAlwaysOn: {
                    surveyBaseObject.tipAlwaysOn = this.toSurveyTextObject(row, surveyBaseObject.tipAlwaysOn);
                    break;
                }
                case VLMSurveyAttribute.TipOnDemand: {
                    surveyBaseObject.tipOnDemand = this.toSurveyTextObject(row, surveyBaseObject.tipOnDemand);
                    break;
                }
                default: {
                    console.log('Survey definition error: Invalid object attribute !', row);
                    break;
                }
            }
        }
        return surveyBaseObject;
    },
    toSurveyAreaObject: function (row, survey, area) {

        if (!survey) {
            console.log("Wrong survey definition, survey record missing: ", row);
            return area;
        }
        if (!area) {
            // spread the base object
            area = this.getSurveyBaseObject();
            area.groups = [];
            survey.areas.push(area);
        }
        this.toSurveyBaseObject(row, area);
        return area;
    },
    toSurveyGroupObject: function (row, area, group) {

        if (!group) {
            // spread the base object
            group = this.getSurveyBaseObject();
            group.questions = [];
            area.groups.push(group);
        }
        this.toSurveyBaseObject(row, group);

        return group;
    },
    toSurveyQuestionObject: function (row, area, group, question) {

        if (!question) {
            // spread the base object
            question = this.getSurveyBaseObject();
            question.media = [];
            question.delegateTo = this.toSurveyDelegateObject(row);
            question.answers = [];
            group.questions.push(question);
        }
        this.toSurveyBaseObject(row, question);
        if (String(row.objtype).toLowerCase() == VLMSurveyAttribute.Body) {
            var contact = this.toSurveyDelegateObject(row);
            if (contact) {
                question.delegateTo = contact;
            }
        }
        // TODO: read media when available
        return question;
    },
    toSurveyAnswerObject: function (row, question, answer) {

        if (!answer) {
            // spread the base object
            answer = this.getSurveyBaseObject();
            answer.options = [];
            answer.media = [];
            answer.answeredBy = null;
            answer.value = null;
            answer.valueOther = null;
            question.answers.push(answer);
        }
        this.toSurveyBaseObject(row, answer);
        if (String(row.objtype).toLowerCase() == VLMSurveyAttribute.Body) {
            var contact = this.toSurveyAnsweredByObject(row);
            if (contact) {
                answer.answeredBy = contact;
            }
            answer.options = answer.options.concat(this.toSurveyAnswerOptionObject(row));
            answer.value = row.custResp;

        }
        // TODO: read value and valueOther when available
        // TODO: read media when available
        return answer;
    },
    toSurveyTextObject: function (row, surveyTextObject) {
        if (!row) {
            return surveyTextObject;
        }
        if (!surveyTextObject) {
            surveyTextObject = {
                dispCfg: this.toDisplayConfig(row),
                ctrlCfg: this.toControlConfig(row),
                texts: this.toSurveyTextItemObject(row, true)
            }
        } else {
            surveyTextObject.texts = surveyTextObject.texts.concat(this.toSurveyTextItemObject(row, false));
        }
        return surveyTextObject;
    },
    toSurveyTextItemObject: function (row, useParentStyle) {

        var items = [];
        if (row && row.valuetext) {
            var lines = String(row.valuetext).split(VLM_TXT_SEP);
            lines.forEach(function (line) {
                let surveyTextItem = {
                    id: row.autoID,
                    text: line,
                    dispCfg: useParentStyle ? null : this.toDisplayConfig(row),
                    ctrlCfg: useParentStyle ? null : this.toControlConfig(row)
                }
                items.push(surveyTextItem);
            }.bind(this))
        }
        return items;
    },
    toControlConfig: function (row) {
        try {
            var data = row.T0012_Control_Cfg;
            if (!data) {
                return null;
            }
            var cnf = JSON.parse(data.toLowerCase());
            if (!cnf || (Object.keys(cnf).length === 0)) {
                return null;
            }
            var obj = {};
            obj.responseType = cnf.responsetype ? this.toString(cnf.responsetype) : undefined;
            obj.mandatory = cnf.mandatory !== undefined ? this.toBool(cnf.mandatory) : undefined;
            obj.min = cnf.min ? this.toInt(cnf.min) : undefined;
            obj.max = cnf.max ? this.toInt(cnf.max) : undefined;
            obj.minLength = cnf.minLength ? this.toInt(cnf.minLength) : undefined;
            obj.maxLength = cnf.maxLength ? this.toInt(cnf.maxLength) : undefined;
            obj.minChecked = cnf.minChecked ? this.toInt(cnf.minChecked) : undefined;
            obj.maxChecked = cnf.maxChecked ? this.toInt(cnf.maxChecked) : undefined;

            return obj;
        } catch (e) {
            console.log("Invalid control configuration: " + String(e), row);
            return null;
        }
    },
    toDisplayConfig: function (row) {
        try {
            return JSON.parse(row.displaycfg.toLowerCase());
        } catch (e) {
            console.log("Invalid display configuration: " + String(e), row);
            return null;
        }
    },
    toSurveyDelegateObject: function (row) {
        // TODO: read delegate to contact when available in the query
        return null;
    },
    toSurveyAnsweredByObject: function (row) {
        if (row.User_ID) {
            return {
                id: row.User_ID,
                first_name: row.T0002_User_FirstName,
                last_name: row.T0002_User_SurName,
                email: row.T0023_Email,
                phone: '',
                desc: ''
            };
        }
        return null;
    },
    toSurveyAnswerOptionObject: function (row) {

        let answerOptions = [];
        if (row.valuetext) {
            var lines = String(row.valuetext).split(VLM_TXT_SEP);
            var optionID = 1;
            lines.forEach(function (line) {
                answerOptions.push({ id: optionID, text: line, hasInput: false, inputType: '', value: null });
                optionID++;
            })
        }
        return answerOptions;
    },
    toString: function (value) {
        return (value === null || value === undefined) ? null : String(value);
    },
    toInt: function (value) {
        return (value === null || value === undefined) ? null : parseInt(value);
    },
    toFloat: function (value) {
        return (value === null || value === undefined) ? null : parseFloat(value);
    },
    toBool: function (value) {
        return (value === null || value === undefined) ? false : String(value).toLowerCase() == 'true';
    }
};

module.exports = Survey2;