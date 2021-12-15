FROM docker.elastic.co/elasticsearch/elasticsearch:7.13.2

COPY . /apps/elasticsearch

RUN ./bin/elasticsearch-plugin install --batch ingest-attachment

EXPOSE 9200