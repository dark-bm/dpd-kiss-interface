/**
 * Module dependencies
 */

var Resource       = require('deployd/lib/resource'),
    util           = require('util'),
    NodeRSA = require('node-rsa');

/**
 * Module setup.
 */

function KissInterface( ) {
    Resource.apply( this, arguments );

    //if(!this.config.privateKey){
    //    this.key = NodeRSA({b: 2048});
    //    this.config.privateKey = this.key.exportKey();
    //}else{
    //    this.key = NodeRSA(this.config.privateKey);
    //}
}
util.inherits( KissInterface, Resource );

KissInterface.label = "KISS Interface";

KissInterface.events = ["post"];

KissInterface.prototype.clientGeneration = true;

KissInterface.basicDashboard = {
    settings: [
        {
            name        : 'ComputersCollection',
            type        : 'text',
            description : 'Computer information collection.'
        }, {
            name        : 'SnmpCollection',
            type        : 'text',
            description : 'SNMP devices collection.'
        }, {
            name        : 'InternalOnly',
            type        : 'checkbox',
            description : 'Only internal queries.'
        }, {
            name        : 'Debug',
            type        : 'checkbox',
            description : 'Write all request info to console.'
        }, {
            name        : 'PrivateKey',
            type        : 'textarea',
            description : 'Private key PEM string.'
        }
    ]
};

/**
 * Module methodes
 */

KissInterface.prototype.handle = function ( ctx, next ) {

    if ( ctx.req && ctx.req.method !== 'POST' ) {
        return next();
    }

    if ( !ctx.req.internal && this.config.InternalOnly ) {
        return ctx.done({ statusCode: 403, message: 'Forbidden' });
    }

    var data = ctx.body || {};

    var errors = {};
    if ( !data.type ) {
        errors.type = '\'type\' is required';
    }
    if ( !data.from ) {
        errors.from = '\'from\' is required';
    }
    if ( !data.packet ) {
        errors.packet = '\'packet\' is required';
    }

    if ( Object.keys(errors).length ) {
        return ctx.done({ statusCode: 400, errors: errors });
    }

    var that = this;

    if (that.config.Debug) {
        console.log('_______________________________________________');
        console.log('Received update:');
        console.log('From:    ', data.from);
        console.log('Type:    ', data.type);
        console.log('```````````````````````````````````````````````');
        return ctx.done( null, { message : 'Simulated' } );
    }

};

/**
 * Module export
 */

module.exports = KissInterface;
