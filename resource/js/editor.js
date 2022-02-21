const $ = require('jquery');

const emojs = [
  { name: 'alien', img: '/images/emoj/alien.png' },
  { name: 'angel', img: '/images/emoj/angel.png' },
  { name: 'angry (1)', img: '/images/emoj/angry (1).png' },
  { name: 'angry (2)', img: '/images/emoj/angry (2).png' },
  { name: 'angry (3)', img: '/images/emoj/angry (3).png' },
  { name: 'angry', img: '/images/emoj/angry.png' },
  { name: 'calm', img: '/images/emoj/calm.png' },
  { name: 'cat (1)', img: '/images/emoj/cat (1).png' },
  { name: 'cat', img: '/images/emoj/cat.png' },
  { name: 'cool', img: '/images/emoj/cool.png' },
  { name: 'cowboy', img: '/images/emoj/cowboy.png' },
  { name: 'crying', img: '/images/emoj/crying.png' },
  { name: 'dead', img: '/images/emoj/dead.png' },
  { name: 'demon', img: '/images/emoj/demon.png' },
  { name: 'devil', img: '/images/emoj/devil.png' },
  { name: 'disappointed', img: '/images/emoj/disappointed.png' },
  { name: 'embarrassed', img: '/images/emoj/embarrassed.png' },
  { name: 'happy (1)', img: '/images/emoj/happy (1).png' },
  { name: 'happy (2)', img: '/images/emoj/happy (2).png' },
  { name: 'happy (3)', img: '/images/emoj/happy (3).png' },
  { name: 'happy', img: '/images/emoj/happy.png' },
  { name: 'in-love', img: '/images/emoj/in-love.png' },
  { name: 'injured', img: '/images/emoj/injured.png' },
  { name: 'kiss', img: '/images/emoj/kiss.png' },
  { name: 'laughing (1)', img: '/images/emoj/laughing (1).png' },
  { name: 'laughing', img: '/images/emoj/laughing.png' },
  { name: 'nerd', img: '/images/emoj/nerd.png' },
  { name: 'poo', img: '/images/emoj/poo.png' },
  { name: 'rich', img: '/images/emoj/rich.png' },
  { name: 'robot', img: '/images/emoj/robot.png' },
  { name: 'sad (1)', img: '/images/emoj/sad (1).png' },
  { name: 'sad', img: '/images/emoj/sad.png' },
  { name: 'secret', img: '/images/emoj/secret.png' },
  { name: 'shocked (1)', img: '/images/emoj/shocked (1).png' },
  { name: 'shocked (2)', img: '/images/emoj/shocked (2).png' },
  { name: 'shocked', img: '/images/emoj/shocked.png' },
  { name: 'sick (1)', img: '/images/emoj/sick (1).png' },
  { name: 'sick', img: '/images/emoj/sick.png' },
  { name: 'silent', img: '/images/emoj/silent.png' },
  { name: 'skull', img: '/images/emoj/skull.png' },
  { name: 'sleeping', img: '/images/emoj/sleeping.png' },
  { name: 'smart', img: '/images/emoj/smart.png' },
  { name: 'surprised (1)', img: '/images/emoj/surprised (1).png' },
  { name: 'surprised (2)', img: '/images/emoj/surprised (2).png' },
  { name: 'surprised', img: '/images/emoj/surprised.png' },
  { name: 'thinking (1)', img: '/images/emoj/thinking (1).png' },
  { name: 'thinking', img: '/images/emoj/thinking.png' },
  { name: 'tongue (1)', img: '/images/emoj/tongue (1).png' },
  { name: 'tongue', img: '/images/emoj/tongue.png' },
  { name: 'wink', img: '/images/emoj/wink.png' }
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
    var text = this.content.text().trim();
    if(!text.length) return this.clear();
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
          } else {
            this.appendEmoj(emojAppend);
          }
          break;
        case "SPAN":
          var selection = $(window.getSelection().anchorNode.parentElement);
          if(selection[0].parentElement === this.content[0]) {
            this.insertAt(selection, emojAppend, offset);
          } else {
            this.appendEmoj(emojAppend);
          }
          break;
        default:
          this.appendEmoj(emojAppend);
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

  appendEmoj(emoj) {
    if (this.content.text().length == 0)
      this.content.empty();
    this.content.append(emoj);
    this.moveSelection(emoj[0].firstChild, 1);
  }
}

module.exports = Editor;