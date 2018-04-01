$(document).ready(function(){
  console.log("initiated");

  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

  let dictationResultOutput = $('#result');
  let convertedOutput = $('#output');
  let submitToChat = $('#submitToChat');
  let chatTextArea = $('#chatTextArea');
  let interimTextDisplay = $('#interimTextDisplay');
  let dictationButton = $('#dictationButton');

  let sentenceArray = [];
  let ofEqualsArray = ['of', 'equals', 'is'];
  let elementMatchCount = 0;
  let idText;
  let classText;
  let submittedChat;
  let elementObjectIndex;

  let final;
  let interim;
  let recognizing;

  const elementsObjectsArray = [
    {
      position: 0,
      name: 'div',
      openTag: '<div>',
      closingTag: '</div>',
      aliases: ['division', 'divider', 'div']
    },
    {
      position: 1,
      name: 'p',
      openTag: '<p>',
      closingTag: '</p>',
      aliases: ['paragraph', 'par', 'p']
    },
    {
      position: 2,
      name: 'h1',
      openTag: '<h1>',
      closingTag: '</h1>',
      aliases: ['heading1', 'heading 1', 'headingone', 'heading one', 'h1']
    }
  ];

  function reset() {
    recognizing = false;
    dictationButton.text('Click to Speak');
  }

  function toggleStartStop() {
    if (recognizing) {
      recognition.stop();
      reset();
    } else {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      reset();

      recognition.start();
      recognizing = true;
      recognition.onend = reset;

      recognition.onresult = function(e) {
        final = '';
        interim = '';
        for (let i = 0; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            final += e.results[i][0].transcript;
            console.log("final transcription:", e.results[i][0].transcript);

          } else {
            interim += e.results[i][0].transcript;
          }
        }

        chatTextArea.text(final);
        interimTextDisplay.text(interim);
      };

      dictationButton.text('Click to Stop');
      chatTextArea.text('');
      interimTextDisplay.text('');
    }
  }

  function splitIntoArray(string) {
    sentenceArray = string.split(' ');
  }

  dictationButton.on('click', function(){
    toggleStartStop();
  });


  // SUBMIT BUTTON CLICK FUNCTION
  submitToChat.on('click', function() {
    event.preventDefault();
    submittedChat = chatTextArea.val().trim();
    chatTextArea.empty();
    chatTextArea.val('');

    console.log(submittedChat);
    splitIntoArray(submittedChat);
    console.log(sentenceArray);

    let result = checkSubmittedTextForElement();
    // console.log("final result:", result);
    elementMatchCount = 0; // resets element match count for future checks

    if (result === "No matching elements found") {
      console.log("I did not find any matching elements in your statement");
    }
    else if (result === "More than one element match found") {
      console.log("I can only create one element at a time.  Which would element do you want to create first?");
    }
    else {
      let selectedElement = elementsObjectsArray[result].name;
      let selectedElementOpenTag = elementsObjectsArray[result].openTag;
      let selectedElementClosingTag = elementsObjectsArray[result].closingTag;
      console.log(selectedElement, selectedElementOpenTag, selectedElementClosingTag);
      // checkTextForElement()
    }

    recognition = "";
  });

  function checkSubmittedTextForElement() {
    sentenceArray.forEach(function(word) {
      elementsObjectsArray.forEach(function(element) {
        let aliasesArray = element.aliases;
        aliasesArray.forEach(function(alias) {
          if (alias === word) {
            elementMatchCount++;
            elementObjectIndex = element.position;
            // console.log("match found: " + alias + " in: " + element.name + " index: " + elementObjectIndex)
          }
        });
      });
    });
    switch (elementMatchCount) {
      // NO MATCHES FOUND
      case 0:
        return "No matching elements found";

      // ONY ONE MATCH FOUND
      case 1:
        // console.log("element referenced:", elementsObjectsArray[elementObjectIndex].name);
        return elementObjectIndex;

      // MORE THAN ONE ELEMENT MATCH IS FOUND
      default:
        return "More than one element match found";
    }
  }

  function tagConstructor (elementTag, elementID, elementClass) {
    // NEEDS DEFINITITION
  }

  // ==============================NEEDS TO BE WORKED INTO ABOVE=========

  function checkTextForElement(){
    if (sentenceArray.includes('division') && sentenceArray.includes('ID') && sentenceArray.includes('class')) {
      let idIndex = sentenceArray.indexOf('ID');
      if (ofEqualsArray.includes(sentenceArray[idIndex + 1]) === true) {
        idText = sentenceArray[idIndex + 2];
      }
      else {
        idText = sentenceArray[idIndex + 1];
      }
      let classIndex = sentenceArray.indexOf('class');
      if (ofEqualsArray.includes(sentenceArray[classIndex + 1]) === true) {
        classText = sentenceArray[classIndex + 2];
      }
      else {
        classText = sentenceArray[classIndex + 1];
      }
      console.log('<div id="' + idText + '" class="' + classText +'"></div>')
    }

    else if (sentenceArray.includes('division') && sentenceArray.includes('class')) {
      let classIndex = sentenceArray.indexOf('class');
      if (ofEqualsArray.includes(sentenceArray[classIndex + 1]) === true) {
        classText = sentenceArray[classIndex + 2];
      }
      else {
        classText = sentenceArray[classIndex + 1];
      }
      console.log('<div class="' + classText +'"></div>');
    }

    else if (sentenceArray.includes('division') && sentenceArray.includes('ID')) {
      let idIndex = sentenceArray.indexOf('ID');
      if (ofEqualsArray.includes(sentenceArray[idIndex + 1]) === true) {
        idText = sentenceArray[idIndex + 2];
      }
      else {
        idText = sentenceArray[idIndex + 1];
      }
      console.log('<div id="' + idText + '"></div>');
    }
    else if (sentenceArray.includes('division')) {
      console.log('<div></div>');
    }
    else {
      console.log('I did not understand')
    }
  }
});