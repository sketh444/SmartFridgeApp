import pickle

def store(all_classifiers):
    filehandler = open("AllClassfier.obj","wb")
    pickle.dump(all_classifiers,filehandler)
    filehandler.close()

def load():
    filehandler = open("AllClassfier.obj",'rb')
    all_classifiers = pickle.load(filehandler)
    filehandler.close()
    return all_classifiers