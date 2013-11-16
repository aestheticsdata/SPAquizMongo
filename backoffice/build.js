;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var createQuestion  = require('./classes/EditCreateQuestion.js');
var deleteQuestions = require('./classes/deleteQuestions.js');

$(function () {
    createQuestion.init();
    deleteQuestions.init();

    $('#editMode').hide();

    $('#createBtn').trigger('click'); // display create view on page load
});
},{"./classes/EditCreateQuestion.js":2,"./classes/deleteQuestions.js":4}],2:[function(require,module,exports){
'use strict';

var appState = require('./appState.js');
var VS       = require('./services/ViewService.js');
var VO       = require('./services/vo/EditCreateViewVO.js');

var editCreateQuestion = {

    createRESTURL: 'http://127.0.0.1:8765/questions',

    editRESTURL: 'http://127.0.0.1:8765/questionsUpdate',

    entry: false,

    init: function (entry) {
        var self = this;
        if (entry) {
            this.entry = entry;
            this.setup(entry);
        } else {
            $('#createBtn').on('click', this.keepScope(this.setup, this));
        }
    },

    setup: function (e) {
        var self = this;

        function onViewLoaded() {
            $('#view')
                .empty()
                .append(VO.content);

            var $addButton       = $('#addButton'),
                $removeButton    = $('#removeButton'),
                $choiceContainer = $('#choiceContainer'),
                $choice          = $('.choice'),
                choiceLength     = $choice.length,
                $logMessage      = $('#logMessage');


            if (!self.entry) { // if entry is null we are in create mode
                $choiceContainer.append('' +
                    '<div class="singleChoiceContainer">' +
                    '<label class="control-label">choice 1: </label>' +
                    '<input type="text" name="choices" class="input-xxlarge choice"></input>' +
                    '<input type="radio" name="correctAnswer" class="radio" value="0" checked="true"></input>' +
                    '</div>');
            } else { // edit mode
                $('#questionForm').prepend('<input type="hidden" id="hidden" name="_id"></script>');
                $('#question').val(self.entry.question);
                $('#hidden').val(self.entry._id);

                for (var i in self.entry.choices ) {
                    $choiceContainer.append('<div class="singleChoiceContainer"><label class="control-label">choice '+(parseInt(i,10)+1)+': </label><input type="text" name="choices" class="input-xxlarge choice" value="'+self.entry.choices[i]+'"></input><input type="radio" name="correctAnswer" class="radio" value="'+i+'" ></input></div>');
                    if (self.entry.correctAnswer == parseInt(i, 10)) {
                        $choiceContainer.find('input[type=radio]').prop('checked', true);
                    }
                }
            }

            $addButton.on('click', function (e) {
                choiceLength = $('.choice').length;
                var choiceInputField = '<div class="singleChoiceContainer"><label>choice '+(choiceLength+1)+': </label><input type="text" name="choices" class="input-xxlarge choice" ></input><input type="radio" class="radio" value="'+choiceLength+'" name="correctAnswer"></input></div>';

                e.preventDefault();

                $choiceContainer.append(choiceInputField);
            });

            $removeButton.on('click', function (e) {
                var $singleChoiceContainer = $('.singleChoiceContainer');
                e.preventDefault();
                if ($singleChoiceContainer.length > 1) {
                    $singleChoiceContainer.last().remove();
                }
            });

            $('#questionForm').submit(function (e) {
                var serializedForm = $(this).serialize();
                var url            = self.entry ? self.editRESTURL : self.createRESTURL;

                e.preventDefault();

                $.post(url, serializedForm)
                    .done(function () {
                        $logMessage
                            .text('question processed')
                            .delay(800)
                            .fadeOut(200);
                        if (appState.isCreate) {
                            $('#questionForm')[0].reset();
                        } else {
                            $('#deleteBtn').trigger('click');
                        }
                    })
                    .fail(function () {
                        $logMessage
                            .css('color', '#f00')
                            .css('background-color', '#000')
                            .text('could not connect to restify');
                    });
            });
        }

        if(!appState.isCreate || appState.isEdit) {
            $('#deleteBtn').removeClass('selectedBtn');

            appState.isCreate = e ? false : true;
            appState.isEdit   = e ? true  : false;
            appState.isDelete = false;

            if (appState.isCreate) {
                $('#createBtn').addClass('selectedBtn');
                self.entry = false; // coming from edit mode we must reset entry
            }

            if (e) { // edit mode
                $('#editMode').show();
            } else { // create mode
                $('#editMode').hide();
            }

            if (VO.content === '') {
                VS.loaded.addOnce(onViewLoaded);
                VS.getView('./views/create.html');
            } else {
                onViewLoaded();
            }
        }
    },

    keepScope: function (listener, context) {
        return function () {
            listener.call(context);
        };
    }
 };

module.exports = editCreateQuestion;
},{"./appState.js":3,"./services/ViewService.js":5,"./services/vo/EditCreateViewVO.js":7}],3:[function(require,module,exports){
'use strict';

var appState = {

    isCreate: false,
    isEdit:   false,
    isDelete: false,

    setState: function (o) {
        this.isCreate = o.isCreate;
        this.isEdit   = o.isEdit;
        this.isDelete = o.isDelete;
    }
};

module.exports = appState;

},{}],4:[function(require,module,exports){
'use strict';

var appState     = require('./appState.js');
var editQuestion = require('./EditCreateQuestion.js');
var VO           = require('./services/vo/deleteViewVO.js');

var deleteQuestions = {
    init: function () {
        $('#deleteBtn').on('click', function () {
            var $deleteBtn = $(this);

            if(!appState.isDelete) {
                $('#createBtn').removeClass('selectedBtn');
                $(this).addClass('selectedBtn');

                appState.isCreate = false;
                appState.isEdit   = false;
                appState.isDelete = true;

                $('#editMode').hide();

                $.get('./views/delete.html', function (data) {
                    $('#view')
                        .empty()
                        .append(data);
                    // TODO: sortir cette function
                    $.getJSON('http://127.0.0.1:8765/questions', function (data) {
                        var $questionsContainer = $('#questionsContainer');

                        $.each(data, function (key, entry) {
                            // TODO : sortir le html
                            var question = '<li><input type="checkbox" id="'+entry._id+'" name="'+entry._id+'"><label class="checkbox inline" for="'+key+'">'+entry.question+'</label></li>';
                            $questionsContainer.append(question);
                            $('#'+entry._id)
                                .next()
                                .on('mouseenter', function (e) {
                                    $(this)
                                        .removeClass('rollOut')
                                        .addClass('rollOver');
                                })
                                .on('mouseleave', function (e) {
                                    $(this)
                                        .removeClass('rollOver')
                                        .addClass('rollOut');
                                })
                                .on('click', function (e) {
                                    editQuestion.init(entry);
                                });
                        });
                        $('#deleteForm').submit(function (e) {
                            e.preventDefault();
                            var serializedForm = $(this).serialize();
                            if ($('input[type=checkbox]:checked').length !== 0) { // if no checkbox are checked disable submit button
                                $.post('http://127.0.0.1:8765/questionsDelete', serializedForm)
                                    .done(function () {
                                        appState.isDelete = false; // needed to reload the page
                                        $deleteBtn.trigger('click'); // reload the page
                                    })
                                    .fail(function () {
                                        $('#errMessage').css('color', '#f00');
                                        $('#errMessage').text('delete error');
                                    });
                            }
                        });
                    });
                });
            }
        });
    }
};

module.exports = deleteQuestions;
},{"./EditCreateQuestion.js":2,"./appState.js":3,"./services/vo/deleteViewVO.js":8}],5:[function(require,module,exports){
'use strict';

var signals = require('signals');
var EditCreateVO = require('./vo/EditCreateViewVO.js');
var DeleteVO = require('./vo/DeleteViewVO.js');

var VS = {

    loaded: new signals.Signal(),

    getView: function (view) {
        var self = this;

        $.get(view, function (data) {
            if(view.search('create')) {
                EditCreateVO.content = data;
            }
            if(view.search('delete')) {
                DeleteVO.content = data;
            }
            self.loaded.dispatch();
        });
    }
};

module.exports = VS;


},{"./vo/DeleteViewVO.js":6,"./vo/EditCreateViewVO.js":7,"signals":9}],6:[function(require,module,exports){
'use strict';

module.exports = {
    content: ''
}

},{}],7:[function(require,module,exports){
module.exports=require(6)
},{}],8:[function(require,module,exports){
module.exports=require(6)
},{}],9:[function(require,module,exports){
/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */
/*global define:false, require:false, exports:false, module:false, signals:false */

/** @license
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license
 * Author: Miller Medeiros
 * Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
 */

(function(global){

    // SignalBinding -------------------------------------------------
    //================================================================

    /**
     * Object that represents a binding between a Signal and a listener function.
     * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
     * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
     * @author Miller Medeiros
     * @constructor
     * @internal
     * @name SignalBinding
     * @param {Signal} signal Reference to Signal object that listener is currently bound to.
     * @param {Function} listener Handler function bound to the signal.
     * @param {boolean} isOnce If binding should be executed just once.
     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param {Number} [priority] The priority level of the event listener. (default = 0).
     */
    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {

        /**
         * Handler function bound to the signal.
         * @type Function
         * @private
         */
        this._listener = listener;

        /**
         * If binding should be executed just once.
         * @type boolean
         * @private
         */
        this._isOnce = isOnce;

        /**
         * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @memberOf SignalBinding.prototype
         * @name context
         * @type Object|undefined|null
         */
        this.context = listenerContext;

        /**
         * Reference to Signal object that listener is currently bound to.
         * @type Signal
         * @private
         */
        this._signal = signal;

        /**
         * Listener priority
         * @type Number
         * @private
         */
        this._priority = priority || 0;
    }

    SignalBinding.prototype = {

        /**
         * If binding is active and should be executed.
         * @type boolean
         */
        active : true,

        /**
         * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
         * @type Array|null
         */
        params : null,

        /**
         * Call listener passing arbitrary parameters.
         * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
         * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
         * @return {*} Value returned by the listener.
         */
        execute : function (paramsArr) {
            var handlerReturn, params;
            if (this.active && !!this._listener) {
                params = this.params? this.params.concat(paramsArr) : paramsArr;
                handlerReturn = this._listener.apply(this.context, params);
                if (this._isOnce) {
                    this.detach();
                }
            }
            return handlerReturn;
        },

        /**
         * Detach binding from signal.
         * - alias to: mySignal.remove(myBinding.getListener());
         * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
         */
        detach : function () {
            return this.isBound()? this._signal.remove(this._listener, this.context) : null;
        },

        /**
         * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
         */
        isBound : function () {
            return (!!this._signal && !!this._listener);
        },

        /**
         * @return {boolean} If SignalBinding will only be executed once.
         */
        isOnce : function () {
            return this._isOnce;
        },

        /**
         * @return {Function} Handler function bound to the signal.
         */
        getListener : function () {
            return this._listener;
        },

        /**
         * @return {Signal} Signal that listener is currently bound to.
         */
        getSignal : function () {
            return this._signal;
        },

        /**
         * Delete instance properties
         * @private
         */
        _destroy : function () {
            delete this._signal;
            delete this._listener;
            delete this.context;
        },

        /**
         * @return {string} String representation of the object.
         */
        toString : function () {
            return '[SignalBinding isOnce:' + this._isOnce +', isBound:'+ this.isBound() +', active:' + this.active + ']';
        }

    };


/*global SignalBinding:false*/

    // Signal --------------------------------------------------------
    //================================================================

    function validateListener(listener, fnName) {
        if (typeof listener !== 'function') {
            throw new Error( 'listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName) );
        }
    }

    /**
     * Custom event broadcaster
     * <br />- inspired by Robert Penner's AS3 Signals.
     * @name Signal
     * @author Miller Medeiros
     * @constructor
     */
    function Signal() {
        /**
         * @type Array.<SignalBinding>
         * @private
         */
        this._bindings = [];
        this._prevParams = null;

        // enforce dispatch to aways work on same context (#47)
        var self = this;
        this.dispatch = function(){
            Signal.prototype.dispatch.apply(self, arguments);
        };
    }

    Signal.prototype = {

        /**
         * Signals Version Number
         * @type String
         * @const
         */
        VERSION : '1.0.0',

        /**
         * If Signal should keep record of previously dispatched parameters and
         * automatically execute listener during `add()`/`addOnce()` if Signal was
         * already dispatched before.
         * @type boolean
         */
        memorize : false,

        /**
         * @type boolean
         * @private
         */
        _shouldPropagate : true,

        /**
         * If Signal is active and should broadcast events.
         * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
         * @type boolean
         */
        active : true,

        /**
         * @param {Function} listener
         * @param {boolean} isOnce
         * @param {Object} [listenerContext]
         * @param {Number} [priority]
         * @return {SignalBinding}
         * @private
         */
        _registerListener : function (listener, isOnce, listenerContext, priority) {

            var prevIndex = this._indexOfListener(listener, listenerContext),
                binding;

            if (prevIndex !== -1) {
                binding = this._bindings[prevIndex];
                if (binding.isOnce() !== isOnce) {
                    throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
                }
            } else {
                binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
                this._addBinding(binding);
            }

            if(this.memorize && this._prevParams){
                binding.execute(this._prevParams);
            }

            return binding;
        },

        /**
         * @param {SignalBinding} binding
         * @private
         */
        _addBinding : function (binding) {
            //simplified insertion sort
            var n = this._bindings.length;
            do { --n; } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
            this._bindings.splice(n + 1, 0, binding);
        },

        /**
         * @param {Function} listener
         * @return {number}
         * @private
         */
        _indexOfListener : function (listener, context) {
            var n = this._bindings.length,
                cur;
            while (n--) {
                cur = this._bindings[n];
                if (cur._listener === listener && cur.context === context) {
                    return n;
                }
            }
            return -1;
        },

        /**
         * Check if listener was attached to Signal.
         * @param {Function} listener
         * @param {Object} [context]
         * @return {boolean} if Signal has the specified listener.
         */
        has : function (listener, context) {
            return this._indexOfListener(listener, context) !== -1;
        },

        /**
         * Add a listener to the signal.
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        add : function (listener, listenerContext, priority) {
            validateListener(listener, 'add');
            return this._registerListener(listener, false, listenerContext, priority);
        },

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        addOnce : function (listener, listenerContext, priority) {
            validateListener(listener, 'addOnce');
            return this._registerListener(listener, true, listenerContext, priority);
        },

        /**
         * Remove a single listener from the dispatch queue.
         * @param {Function} listener Handler function that should be removed.
         * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
         * @return {Function} Listener handler function.
         */
        remove : function (listener, context) {
            validateListener(listener, 'remove');

            var i = this._indexOfListener(listener, context);
            if (i !== -1) {
                this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
                this._bindings.splice(i, 1);
            }
            return listener;
        },

        /**
         * Remove all listeners from the Signal.
         */
        removeAll : function () {
            var n = this._bindings.length;
            while (n--) {
                this._bindings[n]._destroy();
            }
            this._bindings.length = 0;
        },

        /**
         * @return {number} Number of listeners attached to the Signal.
         */
        getNumListeners : function () {
            return this._bindings.length;
        },

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
         * @see Signal.prototype.disable
         */
        halt : function () {
            this._shouldPropagate = false;
        },

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         * @param {...*} [params] Parameters that should be passed to each handler.
         */
        dispatch : function (params) {
            if (! this.active) {
                return;
            }

            var paramsArr = Array.prototype.slice.call(arguments),
                n = this._bindings.length,
                bindings;

            if (this.memorize) {
                this._prevParams = paramsArr;
            }

            if (! n) {
                //should come after memorize
                return;
            }

            bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
            this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

            //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
            //reverse loop since listeners with higher priority will be added at the end of the list
            do { n--; } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        },

        /**
         * Forget memorized arguments.
         * @see Signal.memorize
         */
        forget : function(){
            this._prevParams = null;
        },

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
         */
        dispose : function () {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams;
        },

        /**
         * @return {string} String representation of the object.
         */
        toString : function () {
            return '[Signal active:'+ this.active +' numListeners:'+ this.getNumListeners() +']';
        }

    };


    // Namespace -----------------------------------------------------
    //================================================================

    /**
     * Signals namespace
     * @namespace
     * @name signals
     */
    var signals = Signal;

    /**
     * Custom event broadcaster
     * @see Signal
     */
    // alias for backwards compatibility (see #gh-44)
    signals.Signal = Signal;



    //exports to multiple environments
    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return signals; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = signals;
    } else { //browser
        //use string because of Google closure compiler ADVANCED_MODE
        /*jslint sub:true */
        global['signals'] = signals;
    }

}(this));

},{}]},{},[1])
;