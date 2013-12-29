
/*global
    define
*/

define('PM/Cmp/Upload/FormData', [
    'jquery',
    'js!jquery-inherit',

    // PM
    'PM/Core/Core',
    'PM/Cmp/Upload/Upload'
], function ($, PM, Upload) {
    'use strict';

/* Dependances : PM/Core */

    var DataForm;

    DataForm = $.inherit({

        /**
         * @property {Object} data - Form's data.
         */
        data: {},

        /**
         * @property {?} dataForm - Native instance of FormData.
         */
        dataForm: null,

        /**
         * DataForm constructor.
         * @param {HTMLElement} form - HTML form element.
         * @param {Object}      data - Data(s) to add.
         */
        __constructor: function (form, data) {
            var dataObj = this.data;

            form = $(form);
            this.dataForm = new FormData(form[0]);
            this.append(data);

            if (form) {
                form.find('input, textarea, select').each(function (i, el) {
                    el = $(el);
                    dataObj[el.attr('name')] = el.val();
                });
            }
        },

        /**
         * Append data(s) to the DataForm instance.
         * @param {Object} data - Data(s) to append.
         */
        append: function (data) {
            var dataForm = this.dataForm,
                dataObj = this.data;

            data = data || {};
            $.each(data, function (key, value) {
                dataForm.append(key, value);
                dataObj[key] = value;
            });
        },

        /**
         * Retrun the native FormData in order to send it.
         * @return {FormData} - Native FormData.
         */
        get: function () {
            return this.dataForm;
        },

        /**
         * Retrun datas associated to the FormData.
         * @return {Object} - FormData datas.
         */
        getData: function () {
            return this.data;
        }
    });

    return PM.namespace('FormData', DataForm, Upload);
});
