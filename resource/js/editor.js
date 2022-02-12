const $ = require('jquery');

const emojs = [{
    name: 'angry',
    img: '/images/emoj/angry.png'
  },
  {
    name: 'confused',
    img: '/images/emoj/confused.png'
  },
  {
    name: 'confusing',
    img: '/images/emoj/confusing.png'
  },
  {
    name: 'confusing_1',
    img: '/images/emoj/confusing_1.png'
  },
  {
    name: 'confusion',
    img: '/images/emoj/confusion.png'
  },
  {
    name: 'crying',
    img: '/images/emoj/crying.png'
  },
  {
    name: 'dead-skin',
    img: '/images/emoj/dead-skin.png'
  },
  {
    name: 'dead',
    img: '/images/emoj/dead.png'
  },
  {
    name: 'detective',
    img: '/images/emoj/detective.png'
  },
  {
    name: 'eye-care',
    img: '/images/emoj/eye-care.png'
  },
  {
    name: 'eye',
    img: '/images/emoj/eye.png'
  },
  {
    name: 'eyeem',
    img: '/images/emoj/eyeem.png'
  },
  {
    name: 'find',
    img: '/images/emoj/find.png'
  },
  {
    name: 'flip',
    img: '/images/emoj/flip.png'
  },
  {
    name: 'haha',
    img: '/images/emoj/haha.png'
  },
  {
    name: 'handsome',
    img: '/images/emoj/handsome.png'
  },
  {
    name: 'hug',
    img: '/images/emoj/hug.png'
  },
  {
    name: 'kid',
    img: '/images/emoj/kid.png'
  },
  {
    name: 'laugh',
    img: '/images/emoj/laugh.png'
  },
  {
    name: 'laughing',
    img: '/images/emoj/laughing.png'
  },
  {
    name: 'laughter',
    img: '/images/emoj/laughter.png'
  },
  {
    name: 'love-and-romance',
    img: '/images/emoj/love-and-romance.png'
  },
  {
    name: 'nervous',
    img: '/images/emoj/nervous.png'
  },
  {
    name: 'romance-and-love',
    img: '/images/emoj/romance-and-love.png'
  },
  {
    name: 'romance',
    img: '/images/emoj/romance.png'
  },
  {
    name: 'sad-face',
    img: '/images/emoj/sad-face.png'
  },
  {
    name: 'sad',
    img: '/images/emoj/sad.png'
  },
  {
    name: 'smiles',
    img: '/images/emoj/smiles.png'
  },
  {
    name: 'spooky',
    img: '/images/emoj/spooky.png'
  },
  {
    name: 'star',
    img: '/images/emoj/star.png'
  },
  {
    name: 'superstar',
    img: '/images/emoj/superstar.png'
  },
  {
    name: 'tongue-out',
    img: '/images/emoj/tongue-out.png'
  },
  {
    name: 'tongue',
    img: '/images/emoj/tongue.png'
  },
  {
    name: 'toxic',
    img: '/images/emoj/toxic.png'
  },
  {
    name: 'wow',
    img: '/images/emoj/wow.png'
  },
  {
    name: 'yelling',
    img: '/images/emoj/yelling.png'
  }
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

    if (emojListId) {
      this.emojable = $(emojListId);
      this.renderEmojList();
    }
  }

  clear() {
    this.content.text('').append('<br>');
  }

  submitData() {
    if (!this.submit) return;
    this.submit(this.content.text());
    this.clear();
  }

  renderEmojList() {
    emojs.forEach(emoj => {
      this.emojable.append(`
        <div emoj emoj-name="${emoj.name}" class="p-2">
          <button class="flex items-center justify-center"><img class="w-6 h-6 object-contain" src="${emoj.img}" alt=""></button>
        </div>
      `);
    });
  }
}

module.exports = Editor;