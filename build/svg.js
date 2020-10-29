const svgstore = require('svgstore');
const fs = require('fs');

const sprites = svgstore({
  symbolAttrs: {
    fill: 'currentColor'
  }
});

const add = (name) => {
  sprites.add(name, fs.readFileSync(`./src/assets/svg/${name}.svg`, 'utf8'));
};

add('arrow');
add('connect');
add('disconnect');
add('load');
add('logo');
add('pause');
add('play');
add('save');
add('stop');
add('settings')

fs.writeFileSync('./src/assets/svg/sprites.svg', sprites);
