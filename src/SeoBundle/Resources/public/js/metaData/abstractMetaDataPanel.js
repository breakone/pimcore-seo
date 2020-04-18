pimcore.registerNS('Seo.MetaData.AbstractMetaDataPanel');
Seo.MetaData.AbstractMetaDataPanel = Class.create({

    configuration: null,
    element: null,
    integrator: [],

    layout: null,

    initialize: function (element, configuration) {
        this.configuration = configuration;
        this.element = element;
        this.integrator = [];
    },

    getElement: function () {
        return this.element;
    },

    buildSeoMetaDataTab: function () {

        this.layout = new Ext.FormPanel({
            title: t('SEO'),
            iconCls: 'pimcore_material_icon seo_icon_meta_data',
            border: false,
            autoScroll: true,
            bodyStyle: 'padding:0 10px 0 10px;'
        });

        this.element.tabbar.add(this.layout);

        this.loadElementMetaData();

    },

    loadElementMetaData: function () {

        Ext.Ajax.request({
            url: '/admin/seo/meta-data/get-element-meta-data-configuration',
            params: {
                elementType: this.getElementType(),
                elementId: this.getElementId()
            },
            success: function (response) {
                var resp = Ext.decode(response.responseText);
                if (resp.success === false) {
                    Ext.Msg.alert(t('error'), resp.message);
                    return;
                }

                this.buildMetaDataIntegrator(resp.data, resp.configuration);
            }.bind(this),
            failure: function (response) {
                Ext.Msg.alert(t('error'), t('Error while fetching seo meta data.'));
            }.bind(this)
        });

    },

    buildMetaDataIntegrator: function (data, configuration) {

        Ext.Array.each(this.configuration.enabled_integrator, function (integrator) {

            var integratorName = integrator['integrator_name'],
                integratorClassName = this.getIntegratorClassName(integratorName),
                integratorClass,
                integratorConfiguration = configuration !== null && configuration.hasOwnProperty(integratorName) ? configuration[integratorName] : null,
                integratorData = data !== null && data.hasOwnProperty(integratorName) ? data[integratorName] : null;

            if (Seo.MetaData.Integrator.hasOwnProperty(integratorClassName)) {

                integratorClass = new Seo.MetaData.Integrator[integratorClassName](this.getElementType(), this.getElementId(), integratorName, integratorConfiguration, integratorData);
                this.integrator.push(integratorClass);
                this.layout.add(integratorClass.buildLayout());

            } else {
                console.warn('Integrator class Seo.MetaData.Integrator.' + integratorClassName + ' not found!');
            }

        }.bind(this));
    },

    save: function () {

        var integratorValues = this.getIntegratorValues();

        Ext.Ajax.request({
            url: '/admin/seo/meta-data/set-element-meta-data-configuration',
            method: 'POST',
            params: {
                integratorValues: Ext.encode(integratorValues),
                elementType: this.getElementType(),
                elementId: this.getElementId()
            },
            success: function (response) {
                var resp = Ext.decode(response.responseText);
                if (resp.success === false) {
                    Ext.Msg.alert(t('error'), resp.message);
                }
            },
            failure: function (resp) {
                Ext.Msg.alert(t('error'), t('Error while saving seo meta data.'));
            }
        });
    },

    getIntegratorValues: function () {

        var values = {};
        Ext.Array.each(this.integrator, function (integrator) {
            values[integrator.getType()] = integrator.getValues();
        });

        return values;
    },

    getIntegratorClassName: function (integratorName) {

        var name = integratorName.replace(/(\_\w)/g, function (m) {
            return m[1].toUpperCase();
        });

        return ucfirst(name) + 'Integrator';
    }
});