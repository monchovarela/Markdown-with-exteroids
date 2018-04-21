/* globals Split, axios, CodeMirror*/

// init codemirror
let editor = CodeMirror.fromTextArea(document.getElementById('content'), {
    lineNumbers: true,
    lineWrapping: true,
    tabMode: 'indent',
    mode: 'text/x-markdown'
});


// split left right
Split(['.CodeMirror', '#preview'], {
    sizes: [40, 60],
    minSize: 200
});

// print frame
const printFrame = () => window.frames[0].print();
// render html
const renderHtml = content => {
    axios.post('/render', {
            html: content
        })
        .then(response =>  {
            let result = response.data,
            main = window.frames[0].document.querySelector('main');
            main.innerHTML = result;
        })
        .catch(error =>  console.log(error));
}
// save to file
const saveFile = () => {
        let head = window.frames[0].document.head.innerHTML,
            body = window.frames[0].document.body.innerHTML,
            template = `<!Doctype html><html>${head}${body}</body></html>`,
            blob = new Blob([template], { type: 'text/html' }),
            anchor = document.createElement('a');
    // download file
    anchor.download = "filename.html";
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/html', anchor.download, anchor.href].join(':');
    anchor.click();
}

let data = document.querySelector('#content');

// ctrl + enter 
document.addEventListener("keydown", event => {
    if (event.ctrlKey && event.keyCode === 13) {
        renderHtml(editor.getValue());
    }
});