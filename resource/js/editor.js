const $ = require('jquery');

const emojs = [{
    name: 'angry',
    img: '/images/emoj/angry.png',
    symbol: '😡',
  },
  {
    name: 'confused',
    img: '/images/emoj/confused.png',
    symbol: '😡',
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
  constructor(id, submit, emojDialogId) {
    this.editable = $(id);
    this.submit = submit;
    this.content = $('<p dir="ltr" class="input"><br></p>');
    this.editable.append(this.content);

    if (emojDialogId) {
      this.emojable = $(emojDialogId);
      this.renderEmojList();
    }
    this.registerEvent();
  }

  registerEvent() {
    this.editable.on('keydown', e => {
      var offset = window.getSelection().anchorOffset;
      if (e.code === "Backspace") {
        if (this.content.text().length == 0) e.preventDefault();
        return;
      }

      if (e.keyCode >= 65 && e.keyCode <= 90) {
        var charAppend = String.fromCharCode(e.keyCode);
        if (!e.shiftKey) charAppend = charAppend.toLowerCase();
        var spanAppend = $(`<span>${charAppend}</span>`);
        var selectionElement = $(window.getSelection().anchorNode.parentElement);

        if (this.content.text().length === 0) {
          this.content.text('');
          this.content.append(spanAppend);
          window.getSelection().setBaseAndExtent(spanAppend[0].firstChild, 1, spanAppend[0].firstChild, 1);
          e.preventDefault();
        }

        if (selectionElement.hasClass('emoj')) {
          this.insertAt(selectionElement, spanAppend, offset);
          e.preventDefault();
        }

        return;
      }

      if (e.code === 'Enter') {
        e.preventDefault();
        this.submitData();
      }
    });
  }

  clear() {
    this.content.text('').append('<br>');
  }

  submitData() {
    if (!this.submit) return;
    this.submit(this.content[0].innerHTML);
    this.clear();
  }

  renderEmojList() {
    this.emojable.append(`
      <div class="mb-2">
        <h3 class="text-sky-700 font-semibold uppercase">Emoji</h3>
      </div>
    `);

    this.emojsList = $('<div id="emojList" class="flex flex-wrap -mx-2"></div>').appendTo(this.emojable);

    emojs.forEach(emoj => {
      this.emojsList.append(`
      <div emoj emoj-name="${emoj.name}" class="p-2">
        <button class="flex items-center justify-center"><img class="w-6 h-6 object-contain" src="${emoj.img}" alt=""></button>
      </div>
    `);
    });

    this.emojable.find('[emoj][emoj-name]').on('click', e => {
      this.emojable.addClass('hidden');
      var srcIcon = $(e.currentTarget).find('img').attr('src');
      var emojAppend = this.renderEmojElement(srcIcon);
      var offset = window.getSelection().anchorOffset;

      if (window.getSelection().anchorNode == null) {
        if (this.content.text().length == 0)
          this.content.empty();
        this.content.append(emojAppend);
        this.moveSelection(emojAppend[0].firstChild, 1);
        return;
      }

      switch (window.getSelection().anchorNode.nodeName) {
        case "P":
          if (window.getSelection().anchorNode === this.content[0]) {
            this.content.empty();
            this.content.append(emojAppend);
            this.moveSelection(emojAppend[0].firstChild, 1);
          }
          break;
        case "#text":
          if (window.getSelection().anchorNode.parentElement.parentElement === this.content[0]) {
            var selection = $(window.getSelection().anchorNode.parentElement);
            let text = selection.text();
            if (selection.hasClass('emoj'))
              return this.insertAt(selection, emojAppend, offset);
            if (offset === 0) {
              this.insertAt(selection, emojAppend, 0);
            } else if (offset === text.length) {
              this.insertAt(selection, emojAppend, 1);
            } else {
              selection.text(text.substring(0, offset));
              selection.after(`<span>${text.substring(offset, text.length)}</span>`);
              this.insertAt(selection, emojAppend, 1);
            }
          }
          break;
        case "SPAN":
          var selection = $(window.getSelection().anchorNode.parentElement);
          this.insertAt(selection, emojAppend, offset);
          break;
        default:
          break;
      }

    });
  }

  renderEmojElement(src, el) {
    var emoj = $('<span>😡</span>');
    if (el) {
      emoj = el;
      emoj.text('😡');
    }
    emoj.addClass('emoj');
    emoj.css('background-image', `url('${src}')`);
    return emoj;
  }

  moveSelection(el, offset) {
    window.getSelection().setBaseAndExtent(el, offset, el, offset);
  }

  insertAt(selection, emoj, offset) {
    if (offset === 0) {
      selection.before(emoj);
    } else {
      selection.after(emoj);
    }
    this.moveSelection(emoj[0].firstChild, 1);
  }
}

module.exports = Editor;