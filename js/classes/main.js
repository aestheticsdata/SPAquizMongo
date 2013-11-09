define(function (require) {
    
    "use strict";

    var _ = require('lodash');
    
    var mainWrapper = {

        allQuestions: [],
        questionsLength: 0,
        $warn: $('#warnValidate'),
        $intituleDiv: $('#intitule'),
        $backButton: $('#backButton'),
        $nextButton: $('#nextButton'),
        $choices: $('#choices'),
        checked: false,
        currentQuestion: 0,
        storedAnswers: [],
        firstChange: true,
        score: 0,
        tplFunc: function () {},
    
        initQuestions: function (o) {
            this.allQuestions    = o.allQuestions;
            this.questionsLength = o.questionsLength;
        },

        init: function () {

            $('#afterLogin').show();

            this.$warn.hide();
            this.$warn.html('you have to select an answer');

            this.makeQuestions();

            this.initListener();
        },
        
        makeQuestions: function () {

            var 
                answers = this.allQuestions[this.currentQuestion].choices,
                currentStored = this.storedAnswers[this.currentQuestion],
                answersContext = {},
                i;

            this.$intituleDiv[0].innerHTML = this.allQuestions[this.currentQuestion].question;
            answersContext.questions = answers;
            this.$choices.append(this.tplFunc(answersContext));

            currentStored !== undefined && (i = currentStored);

            this.$choices.children()
                         .eq(i)
                         .children()
                         .attr('checked', 'on');

            this.$choices.fadeTo(200, 1);

            this.makeRadioListener();
        },
       
        nextQuestion: function (end) {

            var self = this;
                
            if (this.storedAnswers[this.currentQuestion+1] === undefined) {
                this.checked = false;
            }

            this.$choices.fadeTo(200, 0, function () {

            $('#questions').find('li').remove();

                if (!end)  {
                    self.currentQuestion += 1;
                    self.makeQuestions();
                }  else {
                    self.computeScore();
                    self.$intituleDiv.html('RESULTS');
                    $('#score').html('your score is : ' + self.score);
                    self.$nextButton.hide();
                    self.$backButton.hide();
                }

                if (self.currentQuestion > 0 && self.currentQuestion < self.questionsLength-1) {
                    self.$backButton.show();
                }
            });
        },
    
        previousQuestion: function () {
                
            var self = this;
            this.checked = true;
            this.$warn.hide();
    
            this.$choices.fadeTo(200, 0, function () {
    
                $('#questions').find('li').remove();
    
                    self.currentQuestion -= 1;
    
                    self.makeQuestions();
    
                    if (self.currentQuestion > 0) {
                        self.$backButton.show();
                    } else {
                        self.$backButton.hide();
                    }
                });
        },
    
        computeScore: function () {
    
            for (var i=0; i<this.questionsLength; i+=1) {
                if (this.storedAnswers[i] === this.allQuestions[i].correctAnswer) {
                    this.score += 1;
                }
            }
        },
        
        makeRadioListener: function () {
    
            var self = this;

            var $inputAnswer = $('input[name="answerRadio"]');
    
            $inputAnswer.on('change', function () {
    
                self.checked = true;
                self.$warn.hide();
                if (self.storedAnswers[self.currentQuestion] !== undefined) {
                    self.firstChange = false;
                }
                self.storedAnswers[self.currentQuestion] = parseInt($inputAnswer.filter(':checked').val(), 10);
            });
        },
    
        initListener: function () {
    
            var self = this;

            this.$nextButton.on('click', function (e) {

                e.preventDefault();

                if (self.checked) {
                    if (self.currentQuestion < self.questionsLength-1) {
                        self.nextQuestion();
                    } else {
                        self.nextQuestion('end');
                    }
                } else {
                    self.$warn.show();
                }
            });

            this.$backButton.on('click', function (e) {

                e.preventDefault();

                self.currentQuestion > 0 && self.previousQuestion();
            });
        }
    };
        
    return mainWrapper;
});