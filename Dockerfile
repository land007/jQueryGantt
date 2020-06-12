FROM land007/node:latest

MAINTAINER Jia Yiqiu <yiqiujia@hotmail.com>

RUN . $HOME/.nvm/nvm.sh && cd / && npm install body-parser express http-proxy basic-auth

ADD api-server/data /node_/data
ADD api-server/public /node_/public
ADD api-server/routes /node_/routes
ADD api-server/server.js /node_/
ADD api-server/proxy.js /node_/
ADD report/main.js /node_/report/main.js
ADD report/node_modules /node_/report/node_modules

ENV username=land007
ENV password=fcea920f7412b5da7be0cf42b8c93759

RUN sed -i 's/\r$//' /*.sh ; chmod +x /*.sh && \
	echo $(date "+%Y-%m-%d_%H:%M:%S") >> /.image_times && \
	echo $(date "+%Y-%m-%d_%H:%M:%S") > /.image_time && \
	echo "land007/gantt" >> /.image_names && \
	echo "land007/gantt" > /.image_name

RUN echo 'nohup node /node/proxy.js > /tmp/proxy.out 2>&1 &' >> /task.sh && \
	echo 'node /node/src-gen/backend/main.js /home/project --hostname=0.0.0.0 --startup-timeout=-1 --inspect=0.0.0.0:9229' >> /start.sh

#docker build -t "land007/gantt:latest" .
#> docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t land007/gantt --push .
#> docker buildx build --platform linux/amd64,linux/arm/v7 -t land007/gantt --push .
#docker run -it --rm -p 80:80 --name gantt land007/gantt:latest
#docker run -it -p 3001:3001 -p 20021:20022 -e "username=gjxt" --rm --name gantt land007/gantt:latest
#docker rm -f gantt ; docker run -it -p 3001:3001 -p 20021:20022 -e "username=gjxt" --restart always --name gantt land007/gantt:latest
#docker run --rm -p 6061:3001 -p 7070:20022 -e "username=gjxt" --name gantt land007/gantt:latest

#centos7
#systemctl start firewalld.service
#docker rm -f gantt ; docker run -it -p 6061:3001 -p 7070:20022 -e "username=gjxt" --restart always --name gantt land007/gantt:latest
#systemctl stop firewalld.service