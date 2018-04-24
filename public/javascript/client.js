/* globals Split, axios, CodeMirror*/

// init app external
let iframe = document.querySelector('iframe').contentWindow,
data = document.querySelector('#content'),
app = null;

// init codemirror with mode markdown
let editor = CodeMirror.fromTextArea(document.getElementById('content'), {
    lineNumbers: true,
    lineWrapping: true,
    tabMode: 'indent',
    mode: 'text/x-markdown'
});

// Check localStorage if exists
// and if exists append in editor
const storage = window.localStorage;
if(storage.getItem('mde-saved')){
  editor.setValue(storage.getItem('mde-saved'));
}

// split left right
const sp = Split(['.CodeMirror', '#preview'], {
    sizes: [42, 57],
    minSize: 350
});

// print frame fn
const printFrame = () => window.frames[0].print();
// render html
const renderHtml = content => {
    let main = iframe.document.querySelector('main');
    // add loading first
    main.innerHTML = 'Loading please wait a momment...';
    // post content
    axios.post('/render', {
            html: content
        })
        .then(response => {
            let result = response.data;
            // add html
            main.innerHTML = result;
            // save editor value in localStorage
            storage.setItem('mde-saved',editor.getValue());
            // send data other window
            var data = {
                    type: 'settings',
                    body: result
            }
            if (app) app.postMessage(JSON.stringify(data),'*');
        })
        .catch(error => console.log(error));
}

// get files for select option
const getFiles = () => {
    axios.get('/templates')
        .then(response => {
            let selectTmpl = document.querySelector('#selectTmpl');
            let templates = '<option value>Templates</option>';
            Array.from(response.data).forEach(item => {
                // remove .md in files
                let txt = item.replace('.md', '');
                templates += `<option value="${item}">${txt}</option>`;
            });
            selectTmpl.innerHTML = templates;
        })
        .catch(error => console.log(error));
}
// init get files
getFiles();


// get file
const getFile = () => { 
    let selectTmpl = document.querySelector('#selectTmpl');
    let txt = selectTmpl.value;
    if(txt){
      editor.setValue('Load file please wait ....');
      // use response.query in express
      axios.get('/template?template=' + txt)
          .then(response => {
              editor.setValue(response.data);
              let w = setTimeout(() => {
                renderHtml(editor.getValue());
                clearTimeout(w);
              },300);
          })
          .catch(error => console.log(error));
    }else{ return false;}
}


// save html file
const saveFile = () => {
    let head = window.frames[0].document.head.innerHTML,
        body = window.frames[0].document.body.innerHTML,
        template = `<!Doctype html><html>${head}${body}</body></html>`,
        blob = new Blob([template], {
            type: 'text/html'
        }),
        anchor = document.createElement('a');
    // download file
    anchor.download = "filename.html";
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/html', anchor.download, anchor.href].join(':');
    anchor.click();
}


// save markdown file
const saveFileMd = () => {
        let blob = new Blob([editor.getValue()], {
            type: 'text/markdown'
        }),
        anchor = document.createElement('a');
    // download file
    anchor.download = "filename.md";
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/markdown', anchor.download, anchor.href].join(':');
    anchor.click();
}


// toggle full screen
const toggleFullEditor = () => {
    console.log('Toggle Full Screen');
    
    let main = document.querySelector('main'),
    toggleBtn = document.querySelector('#toggleFullEditor');
    main.classList.toggle('full-screen-editor');

    if(main.classList.contains('full-screen-editor')){
        toggleBtn.classList.add('active-full-screen-editor');
        sp.collapse(1);
    }else{
        toggleBtn.classList.remove('active-full-screen-editor');
        sp.setSizes([42, 57]);
    }
}

// open external window
const externalWindow = () => {
    let windowName = 'userConsole'; 
    app = window.open('/preview', windowName, 'width=700, height=500, left=0, top=0, scrollbars, resizable');
    if (app == null || typeof(app)=='undefined') {  
        alert('Please disable your pop-up blocker and click the "Open" link again.'); 
    }
}

// ctrl + enter 
document.addEventListener("keydown", event => {
    if (event.ctrlKey && event.keyCode === 13) {
        renderHtml(editor.getValue());
    }
});
// recive posts messages from external app
window.addEventListener('message',function(event) {
    console.log(event);
    if(!event) app = null;
});