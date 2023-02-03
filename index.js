#!/usr/bin/env node
import { SourceMapConsumer } from 'source-map';
import * as fs from 'fs';
import { dirname } from 'path';
import mkdirp from 'mkdirp';

const FIRST_USER_ARG = 2
const path_to_map_file = process.argv[FIRST_USER_ARG];

const SECOND_USER_ARG = 3
const source_directory = process.argv[SECOND_USER_ARG];

// TODO: Cheks if args correctly

if (!fs.existsSync(path_to_map_file)) {
    console.error(`Map file not found: ${path_to_map_file}`);
    process.exit(1);
}

const map_file = fs.readFileSync(path_to_map_file, 'utf8');

SourceMapConsumer.with(map_file, null, main);

function main(consumer) {
    const sources = consumer.sources;
    
    sources.forEach(handle_source);

    function handle_source(source){
        const source_content = consumer.sourceContentFor(source);
        // pop ../ from source
        const file_path = `${process.cwd()}/${source_directory}/${source.substring(3)}`;

        mkdirp.sync(dirname(file_path));
        fs.writeFileSync(file_path, source_content);
    }
}