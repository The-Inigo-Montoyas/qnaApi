# Agile Creations Questions and Answers API

## Contributor

[Gabe Chacon](https://github.com/gabinochacon8 "Gabe Chacon")

## Overview and Results

A team of engineers and I developed a back end API for a single page e-commerce web application. We were given some legacy code from a front end system, and I was tasked with providing the dataset for the questions and answers section.  We were also given csv data in the millions, so I performed an ETL process to load that data into a database. The final result was a back end system that could handle production level traffic.

The first decision I made was the type of database I wanted to use. Whether that was a SQL or NoSQL. I decided on utilyzing PosgreSQL as my RDBMS of choice. After I created my server using Express, I came across my second challenge which was making my queries optimized. At first I made queries on all of the tables, and shaped my data with vanilla JS. But I realized I can optimize my queries using postgres aggregate queries. I stress tested the queries with k6, and I was satisfied with the result of 4ms latency for 1000VUs. I then deployed my database and server with AWS EC2 instances, and I containerized my server image with Docker for faster deployment. I employed Loader.io as a cloud-based stress tester to get my initial performance. To find my bottle necks, I incorporated New Relic to see the individual performance of each instance. I saw that my server was working way too hard, so my next decision was to horizontally scale with more server instances and load balance them with Nginx. At 5 instances, any additional servers were no longer making a difference. I was averraging 390ms with 1000cps for 1 minute for GET requests to the final 10% of the database, but my error rate would not fall below 16%. My final decision was to configure the Nginx setting to a hash instead of round robbin load-balancing technique. I also raised the worker_connection to 8000, and keep-alive_requests to 60000. While I sacrificed my latency from 390ms to 1330ms, my final result was an error rate of 0% with a response counts of 48163. Happy day!

## Technologies Utilized

<a href="https://www.postgresql.org/">PostgreSQL</a>

<a href="https://loader.io//">Loader.io</a>

<a href="https://www.docker.com/">Docker</a>

<a href="https://newrelic.com/">New Relic</a>

<a href="https://aws.amazon.com/">AWS</a>

<a href="https://www.nginx.com/">Nginx</a>
