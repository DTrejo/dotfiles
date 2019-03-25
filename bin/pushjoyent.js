#!/usr/bin/env node
// Copyright 2012 CJ Silverio
// used and modified with permission

var util = require('util'),
    exec = require('child_process').exec
    ;

// rsync -rv -e 'ssh -p 2222' ~/voxer-server root@david-01.voxer.com:/voxer/
var rsync_start = 'rsync -Rvc -e "ssh -p2222" --stats';
var rsync_end = ' root@david-01.voxer.com:/voxer/server';

var child = exec('git status -s', function(err, stdout, stderr)
{
    if (err)
    {
        console.error(err);
        process.exit(1);
    }

    var command = rsync_start;

    var lines = stdout.split('\n');
    for (var i = 0; i < lines.length; i++)
    {
        var item = lines[i].trim();
        if (item[0] === 'R')
        {
            // R  b_signup2.mote -> b_signup_billing.mote
            var ptr = item.indexOf('-> ');
            item = item.substring(ptr + 3);
        }
        else
            item = item.replace(/^.* /, '');
        command += ' ';
        command += item;
    }

    command += rsync_end;

    console.log(command);

    exec(command, function(err, stdout, stderr)
    {
        if (stderr)
            console.error(stderr);
        console.log(stdout);
        process.exit(0);
    });
});

// rsync -Rvuln -e "ssh -p2222" --stats ./webserver/business.js root@ceej.voxer.com:/voxer/server
