// ==UserScript==
// @name         哈信息教务网突破
// @namespace    https://docs.scriptcat.org/
// @version      0.1.0
// @description  你的作业也忘记提交了吗？快试试这个脚本叭！
// @author       Micropue
// @match        https://mdc.greathiit.com/*
// @icon         https://img9.greathiit.com/nopage/icon.png
// @grant        none
// @noframes
// ==/UserScript==


(function () {
    'use strict';
    if (localStorage.getItem("cnm")) {
        const storageDateTime = localStorage.getItem("cnm")
        const OriginalDate = Date
        function FakeDate(...args) {
            if (!(this instanceof FakeDate)) {
                return OriginalDate()
            }
            let instance
            if (args.length === 0) {
                instance = new OriginalDate()
            } else {
                instance = new OriginalDate(...args)
            }
            // 示例：统一加 1 小时
            // instance = new OriginalDate(instance.getTime() + 3600000)
            instance = new OriginalDate(storageDateTime)
            return instance
        }
        FakeDate.prototype = OriginalDate.prototype
        FakeDate.prototype.constructor = FakeDate
        FakeDate.now = function () {
            return OriginalDate.now()
        }
        FakeDate.parse = function (str) {
            return OriginalDate.parse(str)
        }
        FakeDate.UTC = function (...args) {
            return OriginalDate.UTC(...args)
        }
        Object.setPrototypeOf(FakeDate, OriginalDate)
        window.Date = FakeDate
    }
    window.addEventListener("DOMContentLoaded", () => {
        loadDialog({
            changeTime(value) {
                localStorage.setItem("cnm", value)
                window.location.reload()
            },
            changeStatus() {
                document.querySelectorAll(".ant-tag.ant-tag-red.css-vrrzze").forEach(i => i.innerText = "已批改")
            },
            close() {
                document.getElementById("cnm-fuck").style.display = 'none'
            },
            editMode() {
                document.body.style.pointerEvents = 'none'
                document.body.contentEditable = true
            },
            openAllHomeWork() {
                alert("首次启动需要打开允许弹出式窗口")
                document.querySelectorAll(".ant-typography.ant-typography-ellipsis.ant-typography-ellipsis-single-line.css-vrrzze").forEach(i => i.click())
            }
        })
        //获取ID
        const id = getSearchQuery(location.search).id
    })

})();

function getSearchQuery(search) {
    const s = search.replace(/\?/gs, "")
    const p = s.split("&")
    const rst = {}
    for (let i = 0; i < p.length; i++) {
        const f = p[i].split("=")
        rst[f[0]] = f[1];
    }
    return rst
}

function loadDialog(featuresHandle) {
    const element = document.createElement("div")
    const background = document.createElement("div")
    background.id = "cnm-fuck"
    setStyle(background, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
        pointerEvents: "none",
        userSelect: "none",
    })
    setStyle(element, {
        width: "100%",
        maxWidth: "500px",
        maxHeight: "80%",
        overflowY: "auto",
        backgroundColor: "rgb(207 204 255 / 20%)",
        backdropFilter: "blur(10px)",
        borderRadius: "10px",
        padding: "20px",
        pointerEvents: "initial",
        border: "0.5px solid #e7e7e7",
        cursor:"move"
    })
    element.innerHTML = `
        <style>
            .tip{
                color: gray; 
                font-size: 0.8em;
                margin: unset;
            }
            .button{
                background: black;
                color: white;
                border: none;
                padding: 8px 15px;
                font-size: 0.8em;
                border-radius: calc(infinity * 1px);
                font-weight: 900;
                cursor: pointer;
                transition: 0.2s;
            }
            .button:hover{
                background-color: #3d3d3d;
            }
            .button:active{
                transform: scale(0.95);
            }
            .button:disabled{
                background-color: #bdbdbd;
                pointer-events: none;
            }
        </style>
        <h2 style="font-weight: 900;">哈信息教务网突破</h2>
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
            <p class="tip">修改截止时间</p>
            <div style="display: flex; align-items: center; justify-content: center;">
                <input type="datetime-local" class="datetime-picker"/>
                <button class="button get-all-homework-btn" style="margin-left: 10px;">修改</button>
            </div>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
            <p class="tip">全部已批改（用于截图）</p>
            <div style="display: flex; align-items: center; justify-content: center;">
                <button class="button change-status" style="margin-left: 10px;">修改</button>
            </div>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
            <p class="tip">页面编辑模式</p>
            <div style="display: flex; align-items: center; justify-content: center;">
                <button class="button edit-mode" style="margin-left: 10px;">启动</button>
            </div>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
            <p class="tip">一键打开所有作业</p>
            <div style="display: flex; align-items: center; justify-content: center;">
                <button class="button open-all-homework" style="margin-left: 10px;">启动</button>
            </div>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
            <p class="tip">关闭此窗口（刷新后再次打开）</p>
            <div style="display: flex; align-items: center; justify-content: center;">
                <button class="button close" style="margin-left: 10px;">关闭</button>
            </div>
        </div>
    `
    background.append(element)
    document.body.append(background)
    let mousedown = false
    let defaultOffset = {
        x: 0,
        y: 0
    }
    let defaultMouseClient = {
        x: 0,
        y: 0
    }
    const decil = {
        x: 0, y: 0
    }
    window.addEventListener("mousemove", e => {
        if (!mousedown) return
        const { clientX, clientY } = e
        decil.x = defaultOffset.x + clientX - defaultMouseClient.x
        decil.y = defaultOffset.y + clientY - defaultMouseClient.y
        element.style.transform = `translate(${decil.x}px,${decil.y}px)`
    })
    element.addEventListener("mousedown", (e) => {
        if(e.button != 0) return
        mousedown = true
        defaultMouseClient.x = e.clientX
        defaultMouseClient.y = e.clientY
    })
    window.addEventListener("mouseup", () => {
        mousedown = false
        defaultOffset.x = decil.x
        defaultOffset.y = decil.y
    })
    element.querySelector(".get-all-homework-btn").addEventListener("click", () => featuresHandle.changeTime(document.querySelector(".datetime-picker").value))
    element.querySelector(".change-status").addEventListener("click", () => featuresHandle.changeStatus())
    element.querySelector(".close").addEventListener("click", () => featuresHandle.close())
    element.querySelector(".edit-mode").addEventListener("click", () => featuresHandle.editMode())
    element.querySelector(".open-all-homework").addEventListener("click", () => featuresHandle.openAllHomeWork())
    if (localStorage.getItem("cnm")) {
        document.querySelector(".datetime-picker").value = localStorage.getItem("cnm")
    }
}

function setStyle(element, cssList) {
    Object.keys(cssList).forEach(key => {
        element.style[key] = cssList[key]
    })
}
