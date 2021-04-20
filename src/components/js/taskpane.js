import Util from "./util.js"

function onbuttonclick(idStr, param)
{
    if (typeof (wps.Enum) != "object") { // 如果没有内置枚举值
        wps.Enum = Util.WPS_Enum
    }
    switch(idStr)
    {
        case "getString": {
            return GetDoc()
        }
        case "addString":{
            let doc = wps.WpsApplication().ActiveDocument
            if (doc){
                doc.Range(0, 0).Text="Hello, wps加载项!"
                //好像是wps的bug, 这两句话触发wps重绘
                let rgSel = wps.WpsApplication().Selection.Range
                if (rgSel)
                    rgSel.Select()
            }
            break;
        }
        case "getDocName":{
            let doc = wps.WpsApplication().ActiveDocument
            if (!doc){
                return "当前没有打开任何文档"
            }
            return doc.Name
        }
        case "openWeb": {
            wps.OAAssist.ShellExecute(param)
            break
        }
    }
}

function GetDoc() {
    let doc = wps.WpsApplication().ActiveDocument
    if (doc) {
        return doc.Range().Text
    }
    return ''
}

function hilight(ns) {
    let selection = wps.WpsApplication().ActiveWindow.Selection
    let find = selection.Find
    selection.Start = selection.End = 0

    for (let i = 0; i < ns.length; i++) {
        let findResult = find.Execute(ns[i].word)
        if (findResult) {
            console.log(ns[i].word)
            selection.Range.Comments.Add(selection.Range, ns[i].word)
        }
    }
}

function clearHighlight() {
    let doc = wps.WpsApplication().ActiveDocument
    let comments = doc.Comments
    let commentData = []
    for (let i = 1; i <= comments.Count; i++) {
        commentData.push(comments.Item(i))
    }
    commentData.forEach((comment) => {
        comment.Delete()
    })
}

export default{
    onbuttonclick,
    hilight,
    clearHighlight
}