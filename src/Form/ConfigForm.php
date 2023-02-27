<?php declare(strict_types=1);

namespace SingleSignOn\Form;

use Laminas\Form\Element;
use Laminas\Form\Form;
use Omeka\Form\Element as OmekaElement;

class ConfigForm extends Form
{
    public function init(): void
    {
        $this
            ->setAttribute('id', 'singlesignon')
            ->add([
                'name' => 'singlesignon_services',
                'type' => Element\MultiCheckbox::class,
                'options' => [
                    'label' => 'Active services', // @translate
                    'info' => 'Urls for SSO and SLS should be provided if enabled.', // @translate
                    'value_options' => [
                        'sso' => 'Log in (SSO)', // @translate
                        'sls' => 'Log out (SLS)', // @translate
                        'jit' => 'Register (JIT)', // @translate
                        'update' => 'Update user name', // @translate
                    ],
                ],
                'attributes' => [
                    'id' => 'singlesignon_services',
                ],
            ])
            ->add([
                'name' => 'singlesignon_idp_entity_id',
                'type' => Element\Url::class,
                'options' => [
                    'label' => 'IdP Entity Id', // @translate
                    'info' => 'Full url set in attribute `entityID` of xml element `<md:EntityDescriptor>`, for example "https://idp.example.org".', // @translate
                ],
                'attributes' => [
                    'id' => 'singlesignon_idp_entity_id',
                    'required' => true,
                ],
            ])
            ->add([
                'name' => 'singlesignon_idp_sso_url',
                'type' => Element\Url::class,
                'options' => [
                    'label' => 'Url of the IdP single sign-on (SSO) service endpoint', // @translate
                    'info' => 'Full url set in attribute `Location` of xml element `<SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect">`, for example "https://idp.example.org/idp/profile/SAML2/Redirect/SSO".', // @translate
                ],
                'attributes' => [
                    'id' => 'singlesignon_idp_sso_url',
                ],
            ])
            ->add([
                'name' => 'singlesignon_idp_slo_url',
                'type' => Element\Url::class,
                'options' => [
                    'label' => 'Url of the IdP single log out (SLO) service endpoint', // @translate
                    'info' => 'Full url set in attribute `Location` of xml element `<SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect">`, for example "https://idp.example.org/idp/profile/SAML2/Redirect/SLO".', // @translate
                ],
                'attributes' => [
                    'id' => 'singlesignon_idp_slo_url',
                ],
            ])
            ->add([
                'name' => 'singlesignon_idp_x509_certificate',
                'type' => Element\Textarea::class,
                'options' => [
                    'label' => 'Public X.509 certificate of the IdP', // @translate
                ],
                'attributes' => [
                    'id' => 'singlesignon_idp_x509_certificate',
                    'required' => true,
                ],
            ])
            ->add([
                'name' => 'singlesignon_attributes_map',
                'type' => OmekaElement\ArrayTextarea::class,
                'options' => [
                    'label' => 'Optional attributes map between IdP and Omeka', // @translate
                    'info' => 'List of IdP and Omeka keys separated by "=". IdP keys can be canonical or friendly ones. Managed Omeka keys are "email", "name" and "role".', // @translate
                    'as_key_value' => true,
                ],
                'attributes' => [
                    'id' => 'singlesignon_attributes_map',
                    'placeholder' => 'mail = email
displayName = name
role = role',
                ],
            ])
            ->add([
                'name' => 'singlesignon_metadata_mode',
                'type' => Element\Radio::class,
                'options' => [
                    'label' => 'Metadata mode', // @translate
                    'info' => 'Some idp don’t manage xml prefixes in metadata, so they may be removed.', // @translate
                    'value_options' => [
                        'basic' => 'Basic (xml metadata without prefixes)', // @translate
                        'standard' => 'Standard', // @translate
                    ],
                ],
                'attributes' => [
                    'id' => 'singlesignon_metadata_mode',
                ],
            ]);

        $this->getInputFilter()
            ->add([
                'name' => 'singlesignon_services',
                'required' => false,
            ]);
    }
}