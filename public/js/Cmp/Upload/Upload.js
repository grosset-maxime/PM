
/*global
    define
*/

define('PM/Cmp/Upload/Upload', [
    'jquery',
    'js!jquery-inherit',

    // PM
    'PM/Core/Core',
    'PM/Utils/Utils',
    'PM/Cmp/Upload/FormData'
], function ($, PM, Utils, FormData) {
    'use strict';

    var Upload,
        staticObj = {
            /**
             * @static {Int} maxSize - Max upload size can accept the server.
             */
            maxSize: 0,

            /**
             * @static {String} maxSizeDisplay - Max upload size can accept
             * the server in string format.
             */
            maxSizeDisplay: 'unknow Mo'
        };

    Upload = $.inherit({

        /**
         * @property {String} url - Script url to upload file.
         */
        url: '',

        /**
         * @property {Object} data - Optional datas to send to the upload script.
         */
        data: {},

        /**
         * @property {Int} maxUploadedFile - Nb max file could be uploaded by the instance.
         */
        maxUploadedFile: 0,

        /**
         * @property {Int} nbUploadedFile - Nb file uploaded by the instance.
         */
        nbUploadedFile: 0,

        /**
         * @property {Array} uploadedfile - List of uploaded files.
         */
        uploadedfile: [],

        /**
         * Upload constructor.
         * @param {Object} options - Upload options.
         */
        __constructor: function (options) {
            options = $.extend(true, {
                url: '',
                className: '',
                maxUploadedFile: 0,
                data: {},
                events: {
                    onDone: null
                }
            }, options);

            this.url = options.url;
            this.data = options.data;
            this.maxUploadedFile = options.maxUploadedFile;

            this.events = options.events;

            this.buildSkeleton(options);
        },

        /**
         * Build Upload skeleton.
         * @param {Object} options - Upload options.
         */
        buildSkeleton: function (options) {
            var that = this, els = {}, form, fileFinder, chooseFileCtn,
                fileDesc, ctn, progressBar,
                tailleMaxInputText = 255;

            that.els = els;

            ctn = els.ctn = $('<div>', {
                'class': 'pm_upload ' + options.className
            });

            els.loading = $('<div>', {
                'class': 'loading_ctn',
                text: 'Merci de patienter pendant l\'envoi du fichier...'
            }).append($('<img/>', {
                    'class': 'icon_16',
                    src: '/img/loader.gif',
                    alt: 'Loading...'
                })
            ).appendTo(ctn);

            form = els.form = $('<form>').appendTo(ctn);

            fileFinder = els.fileFinder = $('<input/>', {
                type: 'file',
                name: 'attachment_file'
            }).change(function () {
                that.checkSize(this.files[0]);
            });

            progressBar = els.progressBar = $('<progress>', {'class': 'progress_bar'});

            chooseFileCtn = $('<div>', {'class': 'file_ctn'}).append(
                $('<div>', {
                    'class': 'el line',
                    html: fileFinder
                }).append(progressBar),
                $('<div>', {
                    'class': 'max_size_file el line',
                    text: '(taille max autorisée : ' + Upload.maxSizeDisplay + ')'
                }),
                $('<div>', {
                    'class': 'el line'
                }).append(
                    $('<div>', {
                        'class': 'el line',
                        html: $('<input/>', {
                            'class': 'btn_classify',
                            type: 'button',
                            value: 'Classifier'/*,
                            TODO : Rebranch classification
                            click: function () {
                                // Meeting.afficherClassification(' + indiceBloc + ');
                            }*/
                        })
                    }),
                    $('<div>', {'class': 'el line'})
                )
            );

            fileDesc = els.fileDesc = $('<textarea>', {
                'class': 'file_desc',
                name: 'description',
                maxlength: tailleMaxInputText
            });

            form.append(
                chooseFileCtn,
                $('<div>', {
                    'class': 'text_file_desc',
                    text: 'Description du contenu du fichier joint (en insérant des mots clés) :'
                }),
                $('<div>', {
                    'class': 'ctn_file_desc',
                    html: fileDesc
                }),
                $('<div>', {
                    'class': 'send_file_ctn',
                    html: $('<input/>', {
                        'class': 'btn_send_file',
                        type: 'button',
                        value: 'Valider',
                        click: function () {
                            that.run();
                        }
                    })
                })
            );

            els.uploadedFile = $('<div>', {
                'class': 'uploaded_file'
            }).appendTo(ctn);
        },

        /**
         * Inject the Upload form into the DOM Element.
         * @param {HTMLElement} domEl - DOM Element where to inject Upload form.
         */
        inject: function (domEl) {
            if (domEl) {
                $(domEl).append(this.els.ctn);
            }
        },

        /**
         * TODO
         * @param {?} e -
         */
        progressHandling: function (e) {
            if (e.lengthComputable) {
                this.els.progressBar.attr({
                    value: e.loaded,
                    max: e.total
                });
            }
        },

        /**
         * TODO
         */
        run: function () {
            var that = this, xhr, formData, error = false, errorMessage = '',
                els = that.els,
                nbUploadedFile = that.nbUploadedFile,
                maxUploadedFile = that.maxUploadedFile;

            if (!els.fileFinder.val()) {
                errorMessage += '\n\t- Vous n\'avez pas choisi de fichier !';
                error = true;
            }

            if (!els.fileDesc.val()) {
                errorMessage += '\n\t- Vous devez remplir le champ description !';
                error = true;
            }

            if (maxUploadedFile && nbUploadedFile >= maxUploadedFile) {
                errorMessage += '\n\t- Vous avez déjà joint ' +
                    nbUploadedFile +
                    ' fichier(s). Vous ne pouvez pas en joindre un autre.';
                error = true;
            }

            if (!error) {
                els.loading.show();
                formData = new FormData(els.form.get(0), that.data);

                xhr = $.ajax({
                    url: that.url,
                    type: 'POST',
                    dataType: 'json', // response in Json
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) { // Check if upload property exists
                            myXhr.upload.addEventListener(
                                'progress',
                                that.progressHandling.bind(that),
                                false
                            ); // For handling the progress of the upload
                        }
                        return myXhr;
                    },
                    data: formData.get(),
                    context: that,
                    //Options to tell jQuery not to process data or worry about content-type.
                    cache: false,
                    contentType: false,
                    processData: false
                    // beforeSend: beforeSendHandler
                });

                xhr.success(that.done);

                xhr.fail(function (jqXHR, textStatus, errorThrown) {
                    var message = 'PM.Upload.run()';
                    PM.logAjaxFail(jqXHR, textStatus, errorThrown, message);
                });

            } else {
                PM.alert('ATTENTION !' + errorMessage);
            }
        },

        /**
         * Fired when an file is uploaded in a bloc.
         * @param {Object} data -
         */
        done: function (data) {
            var els = this.els, error, errorMessage = '',
                onDoneEvent = this.events.onDone;

            if (!data) {
                PM.alert('Erreur inconnue lors du téléchargement du fichier, merci de réessayer plus tard.');
                els.loading.hide();
                return;
            }

            // Manage error
            if (data.error) {
                error = data.error;

                if (error.sizeFile) {
                    errorMessage += '\n\t- Merci de vérifier la taille de votre fichier. La taille limite est de ' + Upload.maxSizemaxSize + '.';
                }

                if (error.nameFile) {
                    errorMessage += '\n\t- Merci de vérifier le nom de votre fichier.';
                }

                if (!error.sizeFile && !error.nameFile) {
                    PM.log('Upload file Failed. Error:');
                    PM.log(error);
                    errorMessage += '\n\t- L\'envoi du fichier a echoué.';
                }

                PM.alert('ERREUR !!' + errorMessage);
            }

            // Manage success
            if (data.success) {
                this.nbUploadedFile++;

                this.addUploadedFile(data);
                this.clearForm();

                if (onDoneEvent && $.isFunction(onDoneEvent)) {
                    onDoneEvent(data);
                }
            }
        },

        /**
         * Add the uploaded file into uploaded file list and ctn.
         * @param {Object} dataFile - Uploaded file.
         */
        addUploadedFile: function (dataFile) {
            var name, desc, idFile, els = this.els;

            if (!dataFile) {
                return;
            }

            idFile = dataFile.idFile;
            name = dataFile.fileName;
            desc = dataFile.description;

            els.uploadedFile.append(
                $('<div>', {
                    'class': 'up_file_ctn',
                    html: $('<a>', {
                        'class': 'up_file',
                        text: '- ' + name,
                        click: function () {
                            Utils.openUrl('/?r=openFile_s&idFile=' + idFile);
                        }
                    })
                }).append($('<div>', {
                    'class': 'desc',
                    html: desc
                }))
            );

            this.uploadedfile.push({
                id: idFile,
                name: name,
                desc: desc
            });

            els.uploadedFile.show();
        },

        /**
         * Check file size.
         * @param {File} file - File to check the size.
         */
        checkSize: function (file) {
            var size;

            if (!file) {
                return;
            }

            size = file.size;
            if (size > Upload.maxSize) {
                PM.alert('Attention votre fichier est trop volumineux.' +
                    '\nIl ne pourra pas être envoyé.');
                // TODO : Display red cross
            }/* else {
                // TODO : Display green check
            }*/
        },

        /**
         * Clear upload form.
         */
        clearForm: function () {
            var els = this.els;

            els.loading.hide();
            els.fileFinder.val('');
            els.fileDesc.val('');
            // TODO Empty classification
        },

        /**
         * Delete an uploaded file.
         */
        // cancel: function (file) {
        //     // TODO
        // }

    }, staticObj);

    return PM.namespace('Cmp/Upload', Upload, PM);
});
