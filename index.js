const Twig = require('twig');
const fs = require('fs');


const csText = JSON.parse(fs.readFileSync('./KIS_ToS_cs.json', 'utf8'));
Twig.renderFile('./template.twig', {
    lang: 'cs',
    title: csText.title,
    head: csText.head,
    conntent: generateContent(csText.content)
}, (err, html) => {

    fs.writeFile("./compiledCZ.html", html, function (err) {
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