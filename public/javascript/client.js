/* globals Split, axios, CodeMirror*/




// init codemirror
let editor = CodeMirror.fromTextArea(document.getElementById('content'), {
    lineNumbers: true,
    lineWrapping: true,
    tabMode: 'indent',
    mode: 'text/x-markdown'
});


const storage = window.localStorage;
if(storage.getItem('mde-saved')){
  editor.setValue(storage.getItem('mde-saved'));
}


// split left right
Split(['.CodeMirror', '#preview'], {
    sizes: [42, 57],
    minSize: 350
});

// print frame
const printFrame = () => window.frames[0].print();
// render html
const renderHtml = content => {
    let main = window.frames[0].document.querySelector('main');
    main.innerHTML = 'Loading please wait a momment...';
    axios.post('/render', {
            html: content
        })
        .then(response => {
            let result = response.data;
            main.innerHTML = result;
            storage.setItem('mde-saved',editor.getValue());
        })
        .catch(error => console.log(error));
}

const getFiles = () => {
    axios.get('/templates')
        .then(response => {
            let selectTmpl = document.querySelector('#selectTmpl');
            let templates = '<option value>Choose Option</option>';
            Array.from(response.data).forEach(item => {
                let txt = item.replace('.md', '');
                templates += `<option value="${item}">${txt}</option>`;
            });
            selectTmpl.innerHTML = templates;
        })
        .catch(error => console.log(error));
}
getFiles();



const getFile = () => { 
    let selectTmpl = document.querySelector('#selectTmpl');
    let txt = selectTmpl.value;
    if(txt){
      editor.setValue('Load file please wait ....');
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


// save html  file
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


let data = document.querySelector('#content');

// ctrl + enter 
document.addEventListener("keydown", event => {
    if (event.ctrlKey && event.keyCode === 13) {
        renderHtml(editor.getValue());
    }
});