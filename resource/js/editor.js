const $ = require('jquery');

const emojs = [
  {
    name: 'confusing',
    img: '/images/emoj/confusing.png'
  },{
    name: 'confusion',
    img: '/images/emoj/confusion.png'
  },{
    name: 'dead',
    img: '/images/emoj/dead.png'
  },{
    name: 'eyeem',
    img: '/images/emoj/eyeem.png'
  },{
    name: 'laughing',
    img: '/images/emoj/laughing.png'
  },{
    name: 'romance-and-love',
    img: '/images/emoj/romance-and-love.png'
  },{
    name: 'smiles',
    img: '/images/emoj/smiles.png'
  },{
    name: 'spooky',
    img: '/images/emoj/spooky.png'
  },{
    name: 'star',
    img: '/images/emoj/star.png'
  },{
    name: 'tongue',
    img: '/images/emoj/tongue.png'
  },{
    name: 'yelling',
    img: '/images/emoj/yelling.png'
  },
];

class Editor {
  /**
   * 
   * @param {String} id 
   * @param {Function} submit 
   */
  constructor(id, submit, emojListId) {
    this.editable = $(id);
    this.submit = submit;
    this.content = $('<p><br></p>');
    this.editable.append(this.content);
    this.editable.on('keydown', e => {
      if (e.code !== "Enter") return;
      e.preventDefault();
      this.submitData();
    });

    if(emojListId) {
      this.emojable = $(emojListId);
      this.renderEmojList();
    }
  }

  clear() {
    this.content.text('').append('<br>');
  }

  submitData() {
    if(!this.submit) return;
    this.submit(this.content.text());
    this.clear();
  }

  renderEmojList() {
    emojs.forEach(emoj => {
      this.emojable.append(`
        <div emoj emoj-name="${emoj.name}" class="p-2">
          <button class="hover:bg-slate-100 transition-all"><img class="w-6 h-6 object-contain" src="${emoj.img}" alt=""></button>
        </div>
      `);
    });
  }
}

module.exports = Editor;