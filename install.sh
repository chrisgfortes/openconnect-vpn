DIR=${PWD}
cd ./core
./autogen.sh
./configure --prefix=${DIR}
make
sudo make install 
sudo ldconfig
cd ..