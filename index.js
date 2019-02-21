const Twig = require('twig');
const fs = require('fs');
const showdown  = require('showdown');

let converter = new showdown.Converter();


const csObject = JSON.parse(fs.readFileSync('./KIS_ToS_cs.json', 'utf8'));
Twig.renderFile('./template.twig', {
    lang: 'cs',
    title: csObject.title,
    head: csObject.head,
    conntent: generateContent(csObject.content)
}, (err, html) => {

    fs.writeFile("./compiledCS_json.html", html, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("FINISHED");
    });
});

const csMarkdown = fs.readFileSync('./KIS_ToS_cs.md', 'utf8');
Twig.renderFile('./template.twig', {
    lang: 'cs',
    title: 'Kachna IS',
    head: 'Kachna IS',
    conntent: converter.makeHtml(csMarkdown)
}, (err, html) => {

    fs.writeFile("./compiledCS_md.html", html, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("FINISHED");
    });
});

function generateContent(contentObject) {
    let content = '';
    for (let {type, content: subContent} of contentObject) {
        if (type.length === 0) {
            content += `${genereteSubContent(subContent)}\n`;
        } else if (type[0] !== '_') {
            content += `<${type}>${genereteSubContent(subContent)}</${type}>\n`;
        } else if (type === '_list') {
            content += '<ul>\n';
            for (let liText of subContent)
            {
                content += `<li>${liText}</li>\n`;
            }
            content += '</ul>\n';
        }
    }
    return content;
}

function genereteSubContent(subContent) {
    if(typeof subContent === 'string')
    {
        return subContent;
    } else if (Array.isArray(subContent))
    {
        return generateContent(subContent);
    }
}