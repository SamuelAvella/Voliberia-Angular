'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Voliberia-Angular documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AboutPageModule.html" data-type="entity-link" >AboutPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AboutPageModule-0c5d083c955b1776cd1a9fc5d6488458458924ed9b4c431469a9cc7ee49b8d40a6bf9d261b1bffe0dd854ecf19cc7032b6715d554e7f3d01932e4c6b4e49022d"' : 'data-bs-target="#xs-components-links-module-AboutPageModule-0c5d083c955b1776cd1a9fc5d6488458458924ed9b4c431469a9cc7ee49b8d40a6bf9d261b1bffe0dd854ecf19cc7032b6715d554e7f3d01932e4c6b4e49022d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AboutPageModule-0c5d083c955b1776cd1a9fc5d6488458458924ed9b4c431469a9cc7ee49b8d40a6bf9d261b1bffe0dd854ecf19cc7032b6715d554e7f3d01932e4c6b4e49022d"' :
                                            'id="xs-components-links-module-AboutPageModule-0c5d083c955b1776cd1a9fc5d6488458458924ed9b4c431469a9cc7ee49b8d40a6bf9d261b1bffe0dd854ecf19cc7032b6715d554e7f3d01932e4c6b4e49022d"' }>
                                            <li class="link">
                                                <a href="components/AboutPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AboutPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AboutPageRoutingModule.html" data-type="entity-link" >AboutPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AccessDeniedPageModule.html" data-type="entity-link" >AccessDeniedPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AccessDeniedPageModule-149d30f5176ee0a9306a2b0ab371beae105787d87cd07b70d3c49e4dff3bfd4da7f9f3fb3583727f9ab60b842988055f78d10f49b773df90f484a55084f22f66"' : 'data-bs-target="#xs-components-links-module-AccessDeniedPageModule-149d30f5176ee0a9306a2b0ab371beae105787d87cd07b70d3c49e4dff3bfd4da7f9f3fb3583727f9ab60b842988055f78d10f49b773df90f484a55084f22f66"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AccessDeniedPageModule-149d30f5176ee0a9306a2b0ab371beae105787d87cd07b70d3c49e4dff3bfd4da7f9f3fb3583727f9ab60b842988055f78d10f49b773df90f484a55084f22f66"' :
                                            'id="xs-components-links-module-AccessDeniedPageModule-149d30f5176ee0a9306a2b0ab371beae105787d87cd07b70d3c49e4dff3bfd4da7f9f3fb3583727f9ab60b842988055f78d10f49b773df90f484a55084f22f66"' }>
                                            <li class="link">
                                                <a href="components/AccessDeniedPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccessDeniedPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AccessDeniedRoutingModule.html" data-type="entity-link" >AccessDeniedRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-968ae5c8b38bffb41349bc94ec9a1522ef1d65c5b6b04a80163fb737472740bc548cc8b4d60129d7a0fefbc03efceebe66956ff805cb993e6362d7bbd8cd6c09"' : 'data-bs-target="#xs-components-links-module-AppModule-968ae5c8b38bffb41349bc94ec9a1522ef1d65c5b6b04a80163fb737472740bc548cc8b4d60129d7a0fefbc03efceebe66956ff805cb993e6362d7bbd8cd6c09"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-968ae5c8b38bffb41349bc94ec9a1522ef1d65c5b6b04a80163fb737472740bc548cc8b4d60129d7a0fefbc03efceebe66956ff805cb993e6362d7bbd8cd6c09"' :
                                            'id="xs-components-links-module-AppModule-968ae5c8b38bffb41349bc94ec9a1522ef1d65c5b6b04a80163fb737472740bc548cc8b4d60129d7a0fefbc03efceebe66956ff805cb993e6362d7bbd8cd6c09"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BookingsPageModule.html" data-type="entity-link" >BookingsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-BookingsPageModule-4d7d9ca992b804903e539dac58e776e57163c4698d3b978cea357c705445699ed2ae92d18dc95473a11212a214d87970c1adc5fca193fd8394b2245f214553e9"' : 'data-bs-target="#xs-components-links-module-BookingsPageModule-4d7d9ca992b804903e539dac58e776e57163c4698d3b978cea357c705445699ed2ae92d18dc95473a11212a214d87970c1adc5fca193fd8394b2245f214553e9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BookingsPageModule-4d7d9ca992b804903e539dac58e776e57163c4698d3b978cea357c705445699ed2ae92d18dc95473a11212a214d87970c1adc5fca193fd8394b2245f214553e9"' :
                                            'id="xs-components-links-module-BookingsPageModule-4d7d9ca992b804903e539dac58e776e57163c4698d3b978cea357c705445699ed2ae92d18dc95473a11212a214d87970c1adc5fca193fd8394b2245f214553e9"' }>
                                            <li class="link">
                                                <a href="components/BookingsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BookingsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BookingsPageRoutingModule.html" data-type="entity-link" >BookingsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BookPageModule.html" data-type="entity-link" >BookPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-BookPageModule-64c9093a7a0d39f89726f81b874aca954bffe536af11be770d25d2bacd0e1ced782d70f8febc59ee773aa9c6e359633a8aa7150a8be02791952c525560be3835"' : 'data-bs-target="#xs-components-links-module-BookPageModule-64c9093a7a0d39f89726f81b874aca954bffe536af11be770d25d2bacd0e1ced782d70f8febc59ee773aa9c6e359633a8aa7150a8be02791952c525560be3835"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BookPageModule-64c9093a7a0d39f89726f81b874aca954bffe536af11be770d25d2bacd0e1ced782d70f8febc59ee773aa9c6e359633a8aa7150a8be02791952c525560be3835"' :
                                            'id="xs-components-links-module-BookPageModule-64c9093a7a0d39f89726f81b874aca954bffe536af11be770d25d2bacd0e1ced782d70f8febc59ee773aa9c6e359633a8aa7150a8be02791952c525560be3835"' }>
                                            <li class="link">
                                                <a href="components/BookPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BookPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BookPageRoutingModule.html" data-type="entity-link" >BookPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FlightsPageModule.html" data-type="entity-link" >FlightsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-FlightsPageModule-4b360eb73c5f222bf8ae0f36a06c6bcf693d7c802009635508861af478ff2c0d7ab814fb804faef4967633ee8202ca81834646db3e0023641b4d43203453e06a"' : 'data-bs-target="#xs-components-links-module-FlightsPageModule-4b360eb73c5f222bf8ae0f36a06c6bcf693d7c802009635508861af478ff2c0d7ab814fb804faef4967633ee8202ca81834646db3e0023641b4d43203453e06a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FlightsPageModule-4b360eb73c5f222bf8ae0f36a06c6bcf693d7c802009635508861af478ff2c0d7ab814fb804faef4967633ee8202ca81834646db3e0023641b4d43203453e06a"' :
                                            'id="xs-components-links-module-FlightsPageModule-4b360eb73c5f222bf8ae0f36a06c6bcf693d7c802009635508861af478ff2c0d7ab814fb804faef4967633ee8202ca81834646db3e0023641b4d43203453e06a"' }>
                                            <li class="link">
                                                <a href="components/FlightsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FlightsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FlightsPageRoutingModule.html" data-type="entity-link" >FlightsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageModule.html" data-type="entity-link" >HomePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-HomePageModule-749bbe66b01610632ffcbf5bf26121e9567019c30ac48249af3f04b54eea75a905bbebfb4334c8b929572247d40486c3a23fc6484bde54cb3d014ba604581be8"' : 'data-bs-target="#xs-components-links-module-HomePageModule-749bbe66b01610632ffcbf5bf26121e9567019c30ac48249af3f04b54eea75a905bbebfb4334c8b929572247d40486c3a23fc6484bde54cb3d014ba604581be8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomePageModule-749bbe66b01610632ffcbf5bf26121e9567019c30ac48249af3f04b54eea75a905bbebfb4334c8b929572247d40486c3a23fc6484bde54cb3d014ba604581be8"' :
                                            'id="xs-components-links-module-HomePageModule-749bbe66b01610632ffcbf5bf26121e9567019c30ac48249af3f04b54eea75a905bbebfb4334c8b929572247d40486c3a23fc6484bde54cb3d014ba604581be8"' }>
                                            <li class="link">
                                                <a href="components/HomePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageRoutingModule.html" data-type="entity-link" >HomePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageModule.html" data-type="entity-link" >LoginPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-LoginPageModule-8b2cef9140a506817ee594dd811b22e4737108db3023f7fa1a4272440ebf34e5fa2f930a1106424555e17eb419ca0d495e01cadb6c7142d372b345e510bf0b96"' : 'data-bs-target="#xs-components-links-module-LoginPageModule-8b2cef9140a506817ee594dd811b22e4737108db3023f7fa1a4272440ebf34e5fa2f930a1106424555e17eb419ca0d495e01cadb6c7142d372b345e510bf0b96"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginPageModule-8b2cef9140a506817ee594dd811b22e4737108db3023f7fa1a4272440ebf34e5fa2f930a1106424555e17eb419ca0d495e01cadb6c7142d372b345e510bf0b96"' :
                                            'id="xs-components-links-module-LoginPageModule-8b2cef9140a506817ee594dd811b22e4737108db3023f7fa1a4272440ebf34e5fa2f930a1106424555e17eb419ca0d495e01cadb6c7142d372b345e510bf0b96"' }>
                                            <li class="link">
                                                <a href="components/LoginPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageRoutingModule.html" data-type="entity-link" >LoginPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NotFoundPageModule.html" data-type="entity-link" >NotFoundPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-NotFoundPageModule-8c1be2234d35e969393751df2689e2ad669742e227a22a77dd4c1b0c11d9c4c030dfba4a9c8f3cd5d4e4863e99ae16311d041ee818f245f72a5bd35f383a275c"' : 'data-bs-target="#xs-components-links-module-NotFoundPageModule-8c1be2234d35e969393751df2689e2ad669742e227a22a77dd4c1b0c11d9c4c030dfba4a9c8f3cd5d4e4863e99ae16311d041ee818f245f72a5bd35f383a275c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NotFoundPageModule-8c1be2234d35e969393751df2689e2ad669742e227a22a77dd4c1b0c11d9c4c030dfba4a9c8f3cd5d4e4863e99ae16311d041ee818f245f72a5bd35f383a275c"' :
                                            'id="xs-components-links-module-NotFoundPageModule-8c1be2234d35e969393751df2689e2ad669742e227a22a77dd4c1b0c11d9c4c030dfba4a9c8f3cd5d4e4863e99ae16311d041ee818f245f72a5bd35f383a275c"' }>
                                            <li class="link">
                                                <a href="components/NotFoundPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotFoundPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotFoundPageRoutingModule.html" data-type="entity-link" >NotFoundPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProfilePageModule.html" data-type="entity-link" >ProfilePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ProfilePageModule-7bcf6ce895e69eb473d0e7d20cf919e1579a6da3ab265744826409bfb91dbbdf421453f1a80e88288d8f911484986f6cf558b27b105df47b5ab9b13d6118843c"' : 'data-bs-target="#xs-components-links-module-ProfilePageModule-7bcf6ce895e69eb473d0e7d20cf919e1579a6da3ab265744826409bfb91dbbdf421453f1a80e88288d8f911484986f6cf558b27b105df47b5ab9b13d6118843c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProfilePageModule-7bcf6ce895e69eb473d0e7d20cf919e1579a6da3ab265744826409bfb91dbbdf421453f1a80e88288d8f911484986f6cf558b27b105df47b5ab9b13d6118843c"' :
                                            'id="xs-components-links-module-ProfilePageModule-7bcf6ce895e69eb473d0e7d20cf919e1579a6da3ab265744826409bfb91dbbdf421453f1a80e88288d8f911484986f6cf558b27b105df47b5ab9b13d6118843c"' }>
                                            <li class="link">
                                                <a href="components/ProfilePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfilePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfilePageRoutingModule.html" data-type="entity-link" >ProfilePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RegisterPageModule.html" data-type="entity-link" >RegisterPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-RegisterPageModule-e94c8f3c9525717a40b9e18e01bf961289fc6f3d6cf55cad34e6ac6abaae046e520c553f8cd6920a90eb6037dc1febc8c85f8eaf418270dd88823c04374a2281"' : 'data-bs-target="#xs-components-links-module-RegisterPageModule-e94c8f3c9525717a40b9e18e01bf961289fc6f3d6cf55cad34e6ac6abaae046e520c553f8cd6920a90eb6037dc1febc8c85f8eaf418270dd88823c04374a2281"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegisterPageModule-e94c8f3c9525717a40b9e18e01bf961289fc6f3d6cf55cad34e6ac6abaae046e520c553f8cd6920a90eb6037dc1febc8c85f8eaf418270dd88823c04374a2281"' :
                                            'id="xs-components-links-module-RegisterPageModule-e94c8f3c9525717a40b9e18e01bf961289fc6f3d6cf55cad34e6ac6abaae046e520c553f8cd6920a90eb6037dc1febc8c85f8eaf418270dd88823c04374a2281"' }>
                                            <li class="link">
                                                <a href="components/RegisterPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegisterPageRoutingModule.html" data-type="entity-link" >RegisterPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SharedModule-12624490f526c4040f57bae88f47815ec01f7158d957c1702e4c2015b2975a3eb0b8f2a7ba1a52fa8d53e05579ad041d8d2093b96b5330171610cfb93706d299"' : 'data-bs-target="#xs-components-links-module-SharedModule-12624490f526c4040f57bae88f47815ec01f7158d957c1702e4c2015b2975a3eb0b8f2a7ba1a52fa8d53e05579ad041d8d2093b96b5330171610cfb93706d299"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-12624490f526c4040f57bae88f47815ec01f7158d957c1702e4c2015b2975a3eb0b8f2a7ba1a52fa8d53e05579ad041d8d2093b96b5330171610cfb93706d299"' :
                                            'id="xs-components-links-module-SharedModule-12624490f526c4040f57bae88f47815ec01f7158d957c1702e4c2015b2975a3eb0b8f2a7ba1a52fa8d53e05579ad041d8d2093b96b5330171610cfb93706d299"' }>
                                            <li class="link">
                                                <a href="components/BookingModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BookingModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmBookModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmBookModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmCancelModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmCancelModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmRoleModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmRoleModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FlightModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FlightModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FlightSelectableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FlightSelectableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LanguageSelectorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LanguageSelectorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PictureOptionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PictureOptionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PictureSelectableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PictureSelectableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-SharedModule-12624490f526c4040f57bae88f47815ec01f7158d957c1702e4c2015b2975a3eb0b8f2a7ba1a52fa8d53e05579ad041d8d2093b96b5330171610cfb93706d299"' : 'data-bs-target="#xs-directives-links-module-SharedModule-12624490f526c4040f57bae88f47815ec01f7158d957c1702e4c2015b2975a3eb0b8f2a7ba1a52fa8d53e05579ad041d8d2093b96b5330171610cfb93706d299"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-12624490f526c4040f57bae88f47815ec01f7158d957c1702e4c2015b2975a3eb0b8f2a7ba1a52fa8d53e05579ad041d8d2093b96b5330171610cfb93706d299"' :
                                        'id="xs-directives-links-module-SharedModule-12624490f526c4040f57bae88f47815ec01f7158d957c1702e4c2015b2975a3eb0b8f2a7ba1a52fa8d53e05579ad041d8d2093b96b5330171610cfb93706d299"' }>
                                        <li class="link">
                                            <a href="directives/BookingStatusDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BookingStatusDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-SharedModule-12624490f526c4040f57bae88f47815ec01f7158d957c1702e4c2015b2975a3eb0b8f2a7ba1a52fa8d53e05579ad041d8d2093b96b5330171610cfb93706d299"' : 'data-bs-target="#xs-pipes-links-module-SharedModule-12624490f526c4040f57bae88f47815ec01f7158d957c1702e4c2015b2975a3eb0b8f2a7ba1a52fa8d53e05579ad041d8d2093b96b5330171610cfb93706d299"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-12624490f526c4040f57bae88f47815ec01f7158d957c1702e4c2015b2975a3eb0b8f2a7ba1a52fa8d53e05579ad041d8d2093b96b5330171610cfb93706d299"' :
                                            'id="xs-pipes-links-module-SharedModule-12624490f526c4040f57bae88f47815ec01f7158d957c1702e4c2015b2975a3eb0b8f2a7ba1a52fa8d53e05579ad041d8d2093b96b5330171610cfb93706d299"' }>
                                            <li class="link">
                                                <a href="pipes/BookingStateStylePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BookingStateStylePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/LocalizedCurrencyPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalizedCurrencyPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/LocalizedDatePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalizedDatePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/TogglePasswordPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TogglePasswordPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SplashPageRoutingModule.html" data-type="entity-link" >SplashPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UsersPageModule.html" data-type="entity-link" >UsersPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-UsersPageModule-967ee2c567c2ec71844b8163cfcadbe6fe4bc9f9e60b9f03a283e4120585046fc80371dea7a35d8258e84d0bea239cc431c7edc6d3d9f7e5637a1739ce0220e7"' : 'data-bs-target="#xs-components-links-module-UsersPageModule-967ee2c567c2ec71844b8163cfcadbe6fe4bc9f9e60b9f03a283e4120585046fc80371dea7a35d8258e84d0bea239cc431c7edc6d3d9f7e5637a1739ce0220e7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UsersPageModule-967ee2c567c2ec71844b8163cfcadbe6fe4bc9f9e60b9f03a283e4120585046fc80371dea7a35d8258e84d0bea239cc431c7edc6d3d9f7e5637a1739ce0220e7"' :
                                            'id="xs-components-links-module-UsersPageModule-967ee2c567c2ec71844b8163cfcadbe6fe4bc9f9e60b9f03a283e4120585046fc80371dea7a35d8258e84d0bea239cc431c7edc6d3d9f7e5637a1739ce0220e7"' }>
                                            <li class="link">
                                                <a href="components/UsersPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersPageRoutingModule.html" data-type="entity-link" >UsersPageRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/SplashPage.html" data-type="entity-link" >SplashPage</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BaseMediaService.html" data-type="entity-link" >BaseMediaService</a>
                            </li>
                            <li class="link">
                                <a href="classes/StrapiMediaService.html" data-type="entity-link" >StrapiMediaService</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BaseAuthenticationService.html" data-type="entity-link" >BaseAuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BaseRepositoryHttpService.html" data-type="entity-link" >BaseRepositoryHttpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BaseService.html" data-type="entity-link" >BaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BookingMappingStrapi.html" data-type="entity-link" >BookingMappingStrapi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BookingsFirebaseRepositoryService.html" data-type="entity-link" >BookingsFirebaseRepositoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BookingsMappingFirebaseService.html" data-type="entity-link" >BookingsMappingFirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BookingsService.html" data-type="entity-link" >BookingsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BookingsStrapiRepositoryService.html" data-type="entity-link" >BookingsStrapiRepositoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BreakpointsService.html" data-type="entity-link" >BreakpointsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirebaseAuthenticationService.html" data-type="entity-link" >FirebaseAuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirebaseAuthMappingService.html" data-type="entity-link" >FirebaseAuthMappingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirebaseCollectionSubscriptionService.html" data-type="entity-link" >FirebaseCollectionSubscriptionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirebaseMediaService.html" data-type="entity-link" >FirebaseMediaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirebaseRepositoryService.html" data-type="entity-link" >FirebaseRepositoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FlightsMappingFirebaseService.html" data-type="entity-link" >FlightsMappingFirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FlightsMappingStrapi.html" data-type="entity-link" >FlightsMappingStrapi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FlightsService.html" data-type="entity-link" >FlightsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StrapiAuthenticationService.html" data-type="entity-link" >StrapiAuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StrapiAuthMappingService.html" data-type="entity-link" >StrapiAuthMappingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StrapiRepositoryService.html" data-type="entity-link" >StrapiRepositoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TranslationService.html" data-type="entity-link" >TranslationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserAppMappingStrapi.html" data-type="entity-link" >UserAppMappingStrapi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersAppMappingFirebaseService.html" data-type="entity-link" >UsersAppMappingFirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersAppService.html" data-type="entity-link" >UsersAppService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Booking.html" data-type="entity-link" >Booking</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BookingAttributes.html" data-type="entity-link" >BookingAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BookingAttributes-1.html" data-type="entity-link" >BookingAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BookingData.html" data-type="entity-link" >BookingData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BookingData-1.html" data-type="entity-link" >BookingData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BookingRaw.html" data-type="entity-link" >BookingRaw</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BookingRaw-1.html" data-type="entity-link" >BookingRaw</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CollectionChange.html" data-type="entity-link" >CollectionChange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-1.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-2.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-3.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FirebaseBooking.html" data-type="entity-link" >FirebaseBooking</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FirebaseFlight.html" data-type="entity-link" >FirebaseFlight</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FirebaseUserApp.html" data-type="entity-link" >FirebaseUserApp</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlighAttributes.html" data-type="entity-link" >FlighAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Flight.html" data-type="entity-link" >Flight</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlightAttributes.html" data-type="entity-link" >FlightAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlightData.html" data-type="entity-link" >FlightData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlightData-1.html" data-type="entity-link" >FlightData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlightRaw.html" data-type="entity-link" >FlightRaw</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlightRaw-1.html" data-type="entity-link" >FlightRaw</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Formats.html" data-type="entity-link" >Formats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAuthentication.html" data-type="entity-link" >IAuthentication</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAuthMapping.html" data-type="entity-link" >IAuthMapping</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBaseMapping.html" data-type="entity-link" >IBaseMapping</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBaseRepository.html" data-type="entity-link" >IBaseRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBaseService.html" data-type="entity-link" >IBaseService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBookingsRepository.html" data-type="entity-link" >IBookingsRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBookingsService.html" data-type="entity-link" >IBookingsService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICollectionSubscription.html" data-type="entity-link" >ICollectionSubscription</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFlightsRepository.html" data-type="entity-link" >IFlightsRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFlightsService.html" data-type="entity-link" >IFlightsService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IStrapiAuthentication.html" data-type="entity-link" >IStrapiAuthentication</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUsersAppRepository.html" data-type="entity-link" >IUsersAppRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUsersAppService.html" data-type="entity-link" >IUsersAppService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Large.html" data-type="entity-link" >Large</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MediaRaw.html" data-type="entity-link" >MediaRaw</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Medium.html" data-type="entity-link" >Medium</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Meta.html" data-type="entity-link" >Meta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Meta-1.html" data-type="entity-link" >Meta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Meta-2.html" data-type="entity-link" >Meta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Meta-3.html" data-type="entity-link" >Meta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Model.html" data-type="entity-link" >Model</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PagedResult.html" data-type="entity-link" >PagedResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Paginated.html" data-type="entity-link" >Paginated</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginatedRaw.html" data-type="entity-link" >PaginatedRaw</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Pagination.html" data-type="entity-link" >Pagination</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProviderMetadata.html" data-type="entity-link" >ProviderMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchParams.html" data-type="entity-link" >SearchParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SignInPayload.html" data-type="entity-link" >SignInPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SignUpPayload.html" data-type="entity-link" >SignUpPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Small.html" data-type="entity-link" >Small</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiMedia.html" data-type="entity-link" >StrapiMedia</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiMediaData.html" data-type="entity-link" >StrapiMediaData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiMeResponse.html" data-type="entity-link" >StrapiMeResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiSignIn.html" data-type="entity-link" >StrapiSignIn</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiSignInResponse.html" data-type="entity-link" >StrapiSignInResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiSignUp.html" data-type="entity-link" >StrapiSignUp</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiSignUpResponse.html" data-type="entity-link" >StrapiSignUpResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiUser.html" data-type="entity-link" >StrapiUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Thumbnail.html" data-type="entity-link" >Thumbnail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserApp.html" data-type="entity-link" >UserApp</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAppAttributes.html" data-type="entity-link" >UserAppAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAppAttributes-1.html" data-type="entity-link" >UserAppAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAppData.html" data-type="entity-link" >UserAppData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAppData-1.html" data-type="entity-link" >UserAppData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAppRaw.html" data-type="entity-link" >UserAppRaw</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAppRaw-1.html" data-type="entity-link" >UserAppRaw</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAttributes.html" data-type="entity-link" >UserAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserData.html" data-type="entity-link" >UserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserRaw.html" data-type="entity-link" >UserRaw</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});