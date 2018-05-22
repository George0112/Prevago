#!/bin/bash
ps auxww | grep agodaCrawler.py | awk '{print $2}' | xargs kill

