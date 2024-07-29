'use strict';

$(document).ready(function() {

    const hasChosenSelect = typeof $.fn.chosen === 'function';

    /**
     * Configure form.
     *
     * @see module AdvancedSearch asset/js/advanced-search-configure.js
     * @see module SingleSignOn asset/js/single-sign-on-admin.js
     */

    const $formConfig = $('#content > form');

    var ConfigForm = (function() {

        var self = {};

        /**
        * Chosen default options.
        * @see https://harvesthq.github.io/chosen/
        */
        self.chosenOptions = {
            allow_single_deselect: true,
            disable_search_threshold: 10,
            width: '100%',
            include_group_label_in_selected: true,
        };

        self.init = function() {
            self.fieldsetUpdateButtons();
            self.fieldsetUpdateLabels();

            // Move the button plus inside the next fieldset.
            $formConfig.find('.config-fieldset-plus').each(function(no, button) {
                $(button).appendTo($(button).next('fieldset'));
            });

            $formConfig.on('click', '.config-fieldset-minus', self.fieldsetRemove);
            $formConfig.on('click', '.config-fieldset-plus', self.fieldsetAppend);
            $formConfig.on('click', '.config-fieldset-up', self.fieldsetMoveUp);
            $formConfig.on('click', '.config-fieldset-down', self.fieldsetMoveDown);

            return self;
        };

        self.fieldsetRemove = function(ev) {
            $(ev.currentTarget).closest('fieldset').remove();
            self.fieldsetUpdateButtons();
            self.fieldsetUpdateLabels();
            return self;
        };

        self.fieldsetAppend = function(ev) {
            const $fieldset = $(ev.currentTarget).closest('fieldset');
            const template = $fieldset.find('> span[data-template]').attr('data-template');
            if (template) {
                var maxIndex = 0;
                $fieldset.find('> fieldset').each(function(no, item) {
                    const fieldsetName = $(item).attr('name');
                    const fieldsetIndex = fieldsetName.replace(/\D+/g, '');
                    maxIndex = Math.max(maxIndex, fieldsetIndex);
                });
                $fieldset.append(template.split('__index__').join(++maxIndex));
                // Move the button plus and the hidden span at last to simplify
                // up/down with new fieldset, without interspersed elements.
                $(ev.currentTarget).appendTo($fieldset)
                $fieldset.find('span[data-template]').appendTo($fieldset)
                self.fieldsetUpdateButtons();
                self.fieldsetUpdateLabels();
                if (hasChosenSelect) {
                    $fieldset.find('.chosen-select').chosen(self.chosenOptions);
                }
            }
            return self;
        };

        self.fieldsetMoveUp = function(ev) {
            const current = $(ev.currentTarget).closest('fieldset');
            const previous = current.prev('fieldset');
            current.insertBefore(previous);
            self.fieldsetUpdateButtons();
            self.fieldsetUpdateLabels();
            return self;
        };

        self.fieldsetMoveDown = function(ev) {
            const current = $(ev.currentTarget).closest('fieldset');
            const next = current.next('fieldset');
            current.insertAfter(next);
            self.fieldsetUpdateButtons();
            self.fieldsetUpdateLabels();
            return self;
        };

        self.fieldsetUpdateButtons = function() {
            // Remove the field wrapping new buttons.
            $('.config-fieldset-action').each(function(no, button) {
                const field = button.closest('.field');
                if (field) {
                    $(button).insertBefore(field);
                    field.remove();
                }
            });
            // Enable or disable up/down buttons in each fieldset.
            var buttons = $formConfig.find('.config-fieldset-up');
            $formConfig.find('.config-fieldset-up').each(function(no, button) {
                button = $(button);
                const index = self.fieldsetIndex(button.closest('fieldset'));
                if (index <= 1) {
                    button.attr('disabled', 'disabled');
                } else {
                    button.removeAttr('disabled');
                }
            });
            buttons = $formConfig.find('.config-fieldset-down');
            $formConfig.find('.config-fieldset-down').each(function(no, button) {
                button = $(button);
                const index = self.fieldsetIndex(button.closest('fieldset'));
                const fieldset = button.closest('fieldset');
                if (index >= self.fieldsetCount(fieldset)) {
                    button.attr('disabled', 'disabled');
                } else {
                    button.removeAttr('disabled');
                }
            });
            return self;
        };

        self.fieldsetUpdateLabels = function() {
            $('.form-fieldset-collection[data-label-index] > fieldset').each(function(no, fieldset) {
                fieldset = $(fieldset);
                const mainFieldset = fieldset.parent();
                const labelIndex = mainFieldset.data('label-index');
                var legend = fieldset.find('> legend');
                if (!legend.length) {
                    fieldset.prepend('<legend></legend>')
                    legend = fieldset.find('> legend');
                }
                legend.text(labelIndex.replace('{index}', self.fieldsetIndex(fieldset)));
            });
            return self;
        };

        self.fieldsetCount = function(fieldset) {
            fieldset = $(fieldset);
            const mainFieldset = fieldset.parent();
            return mainFieldset.find('> fieldset').length;
        }

        self.fieldsetIndex = function(fieldset) {
            fieldset = $(fieldset);
            const mainFieldset = fieldset.parent();
            return mainFieldset.find('> fieldset').index(fieldset) + 1;
        }

        return self;

    })();

    ConfigForm.init();

});
