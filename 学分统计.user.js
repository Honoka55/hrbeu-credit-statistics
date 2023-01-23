// ==UserScript==
// @name         学分统计
// @namespace    https://github.com/Honoka55/hrbeu-credit-statistics
// @version      0.2
// @description  自动统计课程学分
// @author       Honoka55
// @match        *://*.hrbeu.edu.cn/jwapp/sys/cjcx/*
// @icon         https://avatars.githubusercontent.com/u/71088406?v=4
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';
    // 定义公选课列表
    let courseTypeList = {
        A0: [
            201911300012, 201911800102, 201911800109, 201911800111, 201931600012, 201931700103, 201931700117, 201931700118, 201931700119, 201931700121, 201931700142, 201931700144, 201931700148,
            201931700149, 201931700161, 201931700174
        ],
        A: [
            201910700018, 201910700021, 201911200013, 201911200014, 201911200015, 201911200016, 201911200017, 201911200019, 201911200020, 201911200021, 201911200022, 201911200023, 201911200028,
            201911200029, 201911200030, 201911200031, 201911200032, 201911200033, 201911200034, 201911200035, 201911200037, 201911200038, 201911200039, 201911200040, 201911200044, 201911200045,
            201911300001, 201911300006, 201911300009, 201911300010, 201911300013, 201911300014, 201911300015, 201911300016, 201911300017, 201911300018, 201911300019, 201911300020, 201911400007,
            201911600005, 201911600007, 201911600009, 201911600010, 201911800103, 201911800104, 201911800110, 201912200008, 201931600001, 201931600002, 201931600003, 201931600004, 201931600007,
            201931600008, 201931600009, 201931600016, 201931600017, 201931700120, 201931700122, 201931700124, 201931700126, 201931700128, 201931700129, 201931700131, 201931700132, 201931700134,
            201931700135, 201931700136, 201931700137, 201931700138, 201931700139, 201931700140, 201931700141, 201931700143, 201931700154, 201931700155, 201931700156, 201960100001, 201960100002,
            201961800122
        ],
        B: [
            201910700017, 201910700019, 201911200018, 201931700001, 201931700002, 201931700003, 201931700004, 201931700005, 201931700006, 201931700007, 201931700008, 201931700009, 201931700010,
            201931700011, 201931700012, 201931700013, 201931700014, 201931700015, 201931700016, 201931700017, 201931700018, 201931700019, 201931700020, 201931700021, 201931700022, 201931700023,
            201931700024, 201931700025, 201931700026, 201931700027, 201931700028, 201931700029, 201931700030, 201931700031, 201931700032, 201931700033, 201931700034, 201931700035, 201931700036,
            201931700037, 201931700038, 201931700039, 201931700041, 201931700042, 201931700101, 201931700169, 201931700170, 201931700171, 201931700172
        ],
        C: [
            201910300001, 201910900003, 201911200046, 201931600015, 201931700104, 201931700105, 201931700106, 201931700107, 201931700108, 201931700109, 201931700123, 201931700130, 201931700147,
            201931700153, 201931700157, 201961800132
        ],
        D: [
            201910100004, 201910300006, 201910400001, 201910400002, 201910400004, 201910600001, 201910600004, 201910700004, 201910700008, 201910800001, 201911000002, 201911000004, 201911500001,
            201911500003, 201912400001, 201912400002, 201912400003, 201912500002, 201912500003, 201912500004, 201912500005, 201912500006, 201912500008, 201912500009, 201931700102, 201931700110,
            201931700111, 201931700112, 201931700113, 201931700114, 201931700115, 201931700116
        ],
        E: [
            201910100002, 201910100003, 201910100005, 201910300002, 201910300003, 201910300004, 201910400008, 201910400010, 201910500002, 201910500003, 201910500004, 201910500007, 201911500002,
            201911800101, 201911800105, 201911800106, 201911800108, 201931400001, 201931600010, 201931600011, 201931600013, 201931600014, 201931700177, 201931700178, 201960200001, 201960200002
        ],
        F: [
            201910200001, 201910200002, 201910300005, 201910400003, 201910400005, 201910400006, 201910400007, 201910600002, 201910900002, 201911200041, 201911700002, 201911700003, 201911700004,
            201911700005, 201911700006, 201911700008, 201912400004, 201912500001, 201931000001, 201931000003, 201931600005, 201931600006, 201931700163, 201931700164, 201931700165, 201931700166,
            201931700167, 201931700204, 201931700205, 201931700206, 201931700207, 201931700208, 201931700209, 201931700210, 201931700211, 201961100001
        ]
    };

    // 创建按钮
    let btn = document.createElement('button');
    btn.innerHTML = '统计学分';
    btn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index:99999;';
    document.body.appendChild(btn);

    // 点击按钮时执行
    btn.onclick = function () {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://jwgl.wvpn.hrbeu.edu.cn/jwapp/sys/cjcx/modules/cjcx/xscjcx.do',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                'querySetting':
                    '[{"name":"SFYX","caption":"是否有效","linkOpt":"AND","builderList":"cbl_m_List","builder":"m_value_equal","value":"1","value_display":"是"},{"name":"SHOWMAXCJ","caption":"显示最高成绩","linkOpt":"AND","builderList":"cbl_String","builder":"equal","value":0,"value_display":"否"},{"name":"*order","value":"-XNXQDM,-KCH,-KXH","linkOpt":"AND","builder":"m_value_equal"}]',
                '*order': '-XNXQDM,-KCH,-KXH',
                'pageSize': 200,
                'pageNumber': 1
            },
            onload: function (response) {
                let json = JSON.parse(response.responseText);

                // 定义变量
                let result = {};
                let total = 0;
                let avg = 0;
                let tcredit = 0;
                let courseTypeCredit = { A: 0, A0: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
                // 遍历表格中的每一行
                for (let key in json.datas.xscjcx.rows) {
                    let data = json.datas.xscjcx.rows[key];
                    let courseNum = parseInt(data.KCH); // 课程号
                    let scoreText = data.XSZCJMC; // XS总成绩MC
                    let category = data.KCLBDM_DISPLAY; // 课程类别DM_DISPLAY
                    let nature = data.KCXZDM_DISPLAY; // 课程性质DM_DISPLAY
                    let credit = data.XF; // 学分
                    let pass = data.SFJG_DISPLAY; // 是否及格_DISPLAY

                    // 转化分数为数字
                    let score = 0;
                    if (scoreText === '优秀') {
                        score = 95;
                    } else if (scoreText === '良好') {
                        score = 85;
                    } else if (scoreText === '中等') {
                        score = 75;
                    } else if (scoreText === '及格') {
                        score = 65;
                    } else if (scoreText === '不及格') {
                        score = 30;
                    } else if (scoreText === '缺考') {
                        score = 0;
                    } else {
                        score = parseFloat(scoreText);
                    }

                    // 统计课程类别的学分总和
                    if (!result[category]) {
                        result[category] = 0;
                    }
                    if (pass === '是') {
                        result[category] += credit;
                    }

                    for (let key in courseTypeList) {
                        if ((courseTypeList[key].includes(courseNum) || category.includes(`（${key}）`)) && pass === '是') {
                            courseTypeCredit[key] += credit;
                        }
                    }

                    // 统计必修课的按学分加权的平均分
                    if (nature === '必修') {
                        total += score * credit;
                        tcredit += credit;
                    }
                    // 计算平均分
                    if (tcredit !== 0) {
                        avg = total / tcredit;
                    }
                }

                // 添加一个元素显示统计结果
                let div = document.createElement('div');
                let text = '<!--';
                for (let key in result) {
                    text += key + '：' + result[key] + '学分<br>';
                }
                text += '--><b>学分统计</b><hr>';
                for (let key in courseTypeCredit) {
                    text += key + '：' + courseTypeCredit[key] + '学分<br>';
                }
                let a2c = courseTypeCredit.A + courseTypeCredit.A0 + courseTypeCredit.B + courseTypeCredit.C;
                text += 'A～C：' + a2c + '学分<br>';
                text += '公选：' + (a2c + courseTypeCredit.D + courseTypeCredit.E + courseTypeCredit.F) + '学分<br>';
                text += '专选：' + ((result['专业选修课程'] || 0) + (result['19跨专业选修类（G）'] || 0)) + '学分<br>';
                text += '<hr>';
                text += '必修课加权平均：' + avg.toFixed(2) + '分<br>';
                div.innerHTML = text;

                div.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border-radius: 10px; z-index:99999;';

                // 添加关闭按钮
                let closeBtn = document.createElement('button');
                closeBtn.innerHTML = '关闭';
                closeBtn.style.cssText = 'float: right;';
                closeBtn.onclick = function () {
                    div.remove();
                };
                div.appendChild(closeBtn);
                document.body.appendChild(div);
            }
        });
    };
})();
