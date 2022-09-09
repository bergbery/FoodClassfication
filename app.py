import os 
from flask import Flask, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename

app = Flask(__name__)

from keras.models import load_model 
from keras.backend import set_session
from skimage.transform import resize 
import matplotlib.pyplot as plt 
import tensorflow as tf 
import numpy as np
import ibm_db
import json
#import ibm_db_dbi
#import pandas as pd
#import base64

print("Loading model") 
#global sess
#sess = tf.compat.v1.Session()
#set_session(sess)
global model 
model = load_model('CharKwayTeowNasiLemakRGBWorking.h5') 
#global graph
#graph = tf.compat.v1.get_default_graph()

@app.route('/', methods=['GET', 'POST']) 
def main_page():
    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        file.save(os.path.join('static/uploads', filename))
        return redirect(url_for('prediction', filename=filename))
    return render_template('index.html')

@app.route('/prediction/<filename>') 
def prediction(filename):
    #Step 1
    my_image = plt.imread(os.path.join('static/uploads', filename))
    #Step 2
    my_image_re = resize(my_image, (32,32,3))
    #step 2a
    print(my_image);
    #with open(my_image, "wb") as fh:
    #var vimage64 = fh.write(base64.urlsafe_b64decode('data'))
    
    #Step 3
    #with graph.as_default():
      #set_session(sess)
      #Add
    model.run_eagerly=True  
    probabilities = model.predict(np.array( [my_image_re,] ))[0,:]
    print(probabilities)
    #Step 4
    number_to_class = ['CharKwayTeow', 'NasiLemak']
    index = np.argsort(probabilities)
    predictions = {
      "class1":number_to_class[index[1]],
      "class2":number_to_class[index[0]],
      "prob1":probabilities[index[1]],
      "prob2":probabilities[index[0]],
      "upload_filename":filename,
      #"image64": vimage64,
    }
    #Step 5
    return render_template('predict.html', predictions=predictions, params={})

@app.route('/displaypredict/', methods=['GET']) 
def displaypredict():
    _foodtype = request.args.get('_foodtype')
    _buttondisplay = request.args.get('_buttondisplay')
    #_foodtype='CharKwayTeow'
    #_buttondisplay='both'
    params = {
      "_foodtype":_foodtype,
      "_buttondisplay":_buttondisplay,
    }
    return render_template('predict.html', predictions={},params=params)
 
@app.route('/getingredient/', methods=['GET']) 
def getingredient():
    _foodtype = request.args.get('_foodtype')
    ###conn_str='database=pydev;hostname=host.test.com;port=portno;protocol=tcpip;uid=db2inst1;pwd=secret'
    #conn_str='database=bludb;hostname=98538591-7217-4024-b027-8baa776ffad1.c3n41cmd0nqnrk39u98g.databases.appdomain.cloud;port=30875;protocol=TCPIP;uid=vjd81886;pwd=OicRrtEgVpnkIaxU'
      
    ############################
    dsn_hostname = "9938aec0-8105-433e-8bf9-0fbb7e483086.c1ogj3sd0tgtu0lqde00.databases.appdomain.cloud"# e.g.: "dashdb-txn-sbox-yp-dal09-04.services.dal.bluemix.net"
    dsn_uid = "tqp71934"# e.g. "abc12345"
    dsn_pwd = "mOHtF1Hxhhz7K74t"# e.g. "7dBZ3wWt9XN6$o0J"
        
    dsn_driver = "{IBM DB2 ODBC DRIVER}"
    dsn_database = "bludb"            # e.g. "BLUDB"
    dsn_port = "32459"                # e.g. "50000" 
    dsn_protocol = "TCPIP"            # i.e. "TCPIP"
    dsn_security = "SSL"
        
    dsn = (
    "DRIVER={0};"
    "DATABASE={1};"
    "HOSTNAME={2};"
    "PORT={3};"
    "PROTOCOL={4};"
    "UID={5};"
    "PWD={6};"
    "SECURITY={7};").format(dsn_driver, dsn_database, dsn_hostname, dsn_port, dsn_protocol, dsn_uid, dsn_pwd, dsn_security)
    
    resultJSON = ''
    try:
        conn = ibm_db.connect(dsn, "", "")
        #hdbi = ibm_db_dbi.Connection(conn)

        selectQuery = f"SELECT * FROM TQP71934.INGREDIENT WHERE foodtype = '"+_foodtype.lower()+"'"
        #sql = ibm_db.exec_immediate(conn, "SELECT * FROM TQP71934.INGREDIENT WHERE foodtype = '"+_foodtype.lower()+"'")
        #df=pd.read_sql(selectQuery, hdbi)
        
        #df.head()
        #resultJSON = df.to_json(orient="records")
        
        #Execute the statement
        selectStmt = ibm_db.exec_immediate(conn, selectQuery)
        
        listObj = []
        output = ibm_db.fetch_both(selectStmt)
        while output != False:
            listObj.append(output)
            output = ibm_db.fetch_both(selectStmt)
        
        #resultJSON = json.loads(listObj)
        resultJSON = json.dumps(listObj, separators=(',', ':'))
        print(resultJSON)
        
    except:
        print ("no connection:", ibm_db.conn_errormsg())
    
    return resultJSON
    
@app.route('/getrecipe/', methods=['GET']) 
def getrecipe():
    _foodtype = request.args.get('_foodtype')
    ###conn_str='database=pydev;hostname=host.test.com;port=portno;protocol=tcpip;uid=db2inst1;pwd=secret'
    #conn_str='database=bludb;hostname=98538591-7217-4024-b027-8baa776ffad1.c3n41cmd0nqnrk39u98g.databases.appdomain.cloud;port=30875;protocol=TCPIP;uid=vjd81886;pwd=OicRrtEgVpnkIaxU'
      
    ############################
    dsn_hostname = "9938aec0-8105-433e-8bf9-0fbb7e483086.c1ogj3sd0tgtu0lqde00.databases.appdomain.cloud"# e.g.: "dashdb-txn-sbox-yp-dal09-04.services.dal.bluemix.net"
    dsn_uid = "tqp71934"# e.g. "abc12345"
    dsn_pwd = "mOHtF1Hxhhz7K74t"# e.g. "7dBZ3wWt9XN6$o0J"
        
    dsn_driver = "{IBM DB2 ODBC DRIVER}"
    dsn_database = "bludb"            # e.g. "BLUDB"
    dsn_port = "32459"                # e.g. "50000" 
    dsn_protocol = "TCPIP"            # i.e. "TCPIP"
    dsn_security = "SSL"
        
    dsn = (
    "DRIVER={0};"
    "DATABASE={1};"
    "HOSTNAME={2};"
    "PORT={3};"
    "PROTOCOL={4};"
    "UID={5};"
    "PWD={6};"
    "SECURITY={7};").format(dsn_driver, dsn_database, dsn_hostname, dsn_port, dsn_protocol, dsn_uid, dsn_pwd, dsn_security)
    
    resultJSON = ''
    try:
        conn = ibm_db.connect(dsn, "", "")
        #hdbi = ibm_db_dbi.Connection(conn)

        selectQuery = f"SELECT * FROM TQP71934.RECIPE WHERE foodtype = '"+_foodtype.lower()+"'"
        # sql = ibm_db.exec_immediate(conn, "SELECT * FROM TQP71934.RECIPE WHERE foodtype = '"+_foodtype.lower()+"'")
        #df=pd.read_sql(selectQuery, hdbi)
        
        #df.head()
        #resultJSON = df.to_json(orient="records")
        
        #Execute the statement
        selectStmt = ibm_db.exec_immediate(conn, selectQuery)
        
        listObj = []
        output = ibm_db.fetch_both(selectStmt)
        while output != False:
            listObj.append(output)
            output = ibm_db.fetch_both(selectStmt)
        
        #resultJSON = json.loads(listObj)
        resultJSON = json.dumps(listObj, separators=(',', ':'))
        print(resultJSON)
        
    except:
        print ("no connection:", ibm_db.conn_errormsg())
    
    return resultJSON
    
@app.route('/insertfeedback/', methods=['POST']) 
def insertfeedback():
    if request.method == "POST":
        #vdata=request.json['vuserfeedback']
        vdata=request.get_data();
        vjsondata = json.loads(vdata)
    
        print(vjsondata["name"]);
        
        vname = vjsondata["name"];
        vemail = vjsondata["email"];
        vcontact = vjsondata["contact"];
        vremark = vjsondata["remark"];
    
        ############################
        dsn_hostname = "9938aec0-8105-433e-8bf9-0fbb7e483086.c1ogj3sd0tgtu0lqde00.databases.appdomain.cloud"# e.g.: "dashdb-txn-sbox-yp-dal09-04.services.dal.bluemix.net"
        dsn_uid = "tqp71934"# e.g. "abc12345"
        dsn_pwd = "mOHtF1Hxhhz7K74t"# e.g. "7dBZ3wWt9XN6$o0J"
            
        dsn_driver = "{IBM DB2 ODBC DRIVER}"
        dsn_database = "bludb"            # e.g. "BLUDB"
        dsn_port = "32459"                # e.g. "50000" 
        dsn_protocol = "TCPIP"            # i.e. "TCPIP"
        dsn_security = "SSL"
            
        dsn = (
        "DRIVER={0};"
        "DATABASE={1};"
        "HOSTNAME={2};"
        "PORT={3};"
        "PROTOCOL={4};"
        "UID={5};"
        "PWD={6};"
        "SECURITY={7};").format(dsn_driver, dsn_database, dsn_hostname, dsn_port, dsn_protocol, dsn_uid, dsn_pwd, dsn_security)
        
        resultJSON = ''
        try:
            conn = ibm_db.connect(dsn, "", "")
            #hdbi = ibm_db_dbi.Connection(conn)

            #sql = "INSERT INTO TQP71934.FEEDBACK (NAME,EMAIL,CONTACT,REMARK) VALUES ('"+vname+"','"+vemail+"','"+vcontact+"','"+vremark+"',)"
            sql = "INSERT INTO TQP71934.FEEDBACK (NAME,EMAIL,CONTACT,REMARK) VALUES (?,?,?,?)"
            stmt = ibm_db.prepare(conn, sql)
            
            ibm_db.bind_param(stmt, 1, vname)
            ibm_db.bind_param(stmt, 2, vemail)
            ibm_db.bind_param(stmt, 3, vcontact)
            ibm_db.bind_param(stmt, 4, vremark)
            
            #Execute the statement
            #prepStmt = ibm_db.prepare(conn, insertQuery)
            ibm_db.execute(stmt)
            
            result_dict = ibm_db.fetch_assoc(stmt)
            while result_dict is not False:
                print(result_dict)
                result_dict = ibm_db.fetch_assoc(stmt)
                
            #listObj = []
            #output = ibm_db.fetch_both(stmt)
            #while output != False:
            #    listObj.append(output)
            #    output = ibm_db.fetch_both(stmt)  

            #resultJSON = json.loads(listObj)
            #resultJSON = json.dumps(listObj, separators=(',', ':'))
            #print(resultJSON)
                
        except:
            print ("no connection:", ibm_db.conn_errormsg())
    
    return resultJSON


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
