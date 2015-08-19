#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
Load and manage the data to be used in the project


Created on 08/18/2015
'''

__author__='ucaiado'


import pandas as pd
import numpy as np
import csv
import zipfile
import sys



#name global variables
L_FIELDS = ["CNT","ESCS","STIDSTD","PV1MATH","PV1READ","PV1SCIE","BELONG", 
"OUTHOURS", "ST28Q01", "ST57Q01"]
S_GDP = "data/OCDE_GDP_percapta.csv"
S_CONT = "data/continents.csv"


'''
Begin of Help Functions
'''
def _getFields(l_fields, row):
    '''
    Return a dictionary with the data into the row, filtering 
    the fields passed 
    '''
    return {k: row.get(k, None) for k in l_fields}


def rename_contries(l_names):
    """
    rename the name of each string in a list by names pre-selected inside the 
    function. Return a new list with the names modifieds
    """
    set_names = set(l_names)
    b=[x.strip() for x in set_names]
    d_newNames = dict(zip(b,b))
    l2 = ["UAE", "UK", "Serbia", "South Korea", "Taiwan", "Slovakia", "Russia", 
          "Russia", "Hong Kong","China", "Macau", "USA", "USA","USA", "USA",
          "Vietnam", "Macau", "Hong Kong","China", "Norway", "USA","Macau"]
    
    l1 = ["United Arab Emirates","United Kingdom","Serbia","Korea",
    "Chinese Taipei","Slovak Republic","Russian Federation",
    "Perm(Russian Federation)","Hong Kong-China", "China-Shanghai", "Macau",
    "Connecticut (USA)","Florida (USA)", "Massachusetts (USA)", 
    "United States of America", "Viet Nam", "Macao - China", 
    "Hong Kong - China", "Shanghai - China", "Norway1", 'United States',
    'Macao-China']

    for s1, s2 in zip(l1,l2):
        if s1 in set_names:
           d_newNames[s1] = s2
    
    l_rtn = [d_newNames[x] for x in l_names] 
    return l_rtn

'''
End of Help Functions
'''

class loadPISA:
    '''
    Load and handle the dataset used in the project
    '''
    def __init__(self,s_fname, l_fields=L_FIELDS, s_gdp=S_GDP, s_cont = S_CONT):
        '''
        Initialize a LoadData instance. Save all parameters as attributes
        -------------------------
        s_fname: path to the PISA file
        l_fields: list of strings with the fields in PISA file desired
        s_gdp: the path to GDP file
        '''
        self.s_file = s_fname
        self.df = self._loadData(l_fields)
        self.df = self.correctTypes()
        self.df_gdp = self._loadGDP(s_gdp)
        self.df, self.df_gdp = self._imputGDPinPisa(self.df, self.df_gdp)
        self.df_continents = self._loadContinents(s_cont)
        self.df = self.setCountriesContinents()
        self.df = self.bucketizePisa()
        self.df = self.reduceData()
        self.df_avgByCountry = self._createGroupedData()

    def getContinents(self):
        '''
        Return a copy of Continents dataframe
        '''
        return self.df_continents.copy()

    def getPisa(self):
        '''
        Return a copy of Pisa dataframe
        '''
        return self.df.copy()

    def getGDP(self):
        '''
        Return a copy of Pisa dataframe
        '''
        return self.df_gdp.copy()

    def setCountriesContinents(self):
        '''
        Return pisa dataframe with the countries classify by continent
        '''
        df = self.getPisa()
        df['continent'] = None
        df['continent'] = self.df_continents.loc[self.df.CNT1.values].values

        return df

    def correctTypes(self):
        '''
        Correct the data types in pisa dataframe
        '''
        #load data
        df = self.getPisa()
        #correct datatypes
        df.PV1MATH = df.PV1MATH.astype(float)
        df.ESCS[df.ESCS=="NA"]=None
        df.ESCS = df.ESCS.astype(float)
        df.ST57Q01[df.ST57Q01=="NA"]=None
        df.ST57Q01 = df.ST57Q01.astype(float)  

        return df

    def reduceData(self):
        '''
        Exclude all rows and columns that will be not used in the study
        '''
        #load data
        df2 = self.getPisa()
        #exclude columns
        df2.drop(["BELONG", "OUTHOURS", "PV1READ", "PV1SCIE", "ST28Q01", "CNT",
            "STIDSTD"], axis=1, inplace = True)
        #exclude rows
        df2.drop(df2[df2.isnull().sum(axis=1)>0].index, inplace=True)

        return df2

    def bucketizePisa(self):
        '''
        Create buckets to the aaa columns in df_pisa and returns a new dataframe
        with these data included
        '''
        #load data
        df = self.getPisa()
        #create bins limites to the ESCS data
        a_heights, a_bins = np.histogram(df.ESCS[~df['ESCS'].isnull()],bins = 7)
        #bucketize ESCS (Social satus)
        df["ESCS_bk2"] = None
        df["ESCS_bk2"] = pd.cut(df.ESCS, bins= a_bins)
        #bucketize ST57Q01 (time spent)
        l_bins = [0, 2,4,5,7,8,10,12,15, 30]
        df["ST57Q01_bk"] = None
        df["ST57Q01_bk"]  =pd.cut(df.ST57Q01, bins = l_bins) 

        return df       

    def _createGroupedData(self):
        '''
        Group data by country and take the meah of math scores
        '''
        #group data
        df = self.getPisa()
        df_continents = self.getContinents()
        df_grouped = df.groupby("CNT1").mean()
        #insert the continent of each country in the dataframe
        df_grouped["continent"] = None
        df_grouped["continent"]  = df_continents.loc[df_grouped.index].values

        return df_grouped

    def _loadData(self, l_fields):
        '''
        Return a dataframe of the PISA data desired
        '''
        with open(self.s_file, 'rb') as f1:
            zfile = zipfile.ZipFile(f1)
            l_rtn = []
            with zfile.open(zfile.filelist[0].filename) as f:
                reader = csv.DictReader(f)
                for idx, row in enumerate(reader):
                    #count lines processed
                    if idx%50000==0: print "estou na linha {}".format(idx)
                    #get data desired
                    l_rtn.append(_getFields(l_fields, row))
            print "estou na linha {}".format(idx)

        df = pd.DataFrame(l_rtn)
            
        return df  


    def _loadGDP(self, s_gdp):
        '''
        return a dataframe with the GDP file content filtered by the last year
        '''
        df_gdp = pd.read_csv(s_gdp, sep = "\t")
        df_gdp = df_gdp.loc[df_gdp["Year"]=="PISA 2012"]

        return df_gdp

    def _loadContinents(self, s_continents):
        '''
        Return a dataframe with the Continent dataset
        '''
        df_continents = pd.read_csv("data/continents.csv", sep = "\t")
        df_continents.index=df_continents.CNT1.values
        df_continents.drop(["CNT1"], axis=1, inplace=True)

        return df_continents

    def _imputGDPinPisa(self, df_pisa, df_gdp):
        '''
        Return the dataframes passed with new columns included. Insert GDP 
        informationin df_pisa and a column with new names. Insert new names in 
        df_gdp
        '''
        #load data
        df_pisa = self.getPisa()
        df_gdp = self.getGDP()
        #correct names in df_pisa
        df_pisa["CNT1"] = None
        df_pisa["CNT1"] = rename_contries(list(df_pisa.CNT))
        #correct names in df_gdp
        df_gdp["country1"] = None
        df_gdp["country1"] = rename_contries(list(df_gdp.country))
        df_gdp.index = list(df_gdp.country1)
        #insert GDP infos in PISA
        df_pisa["perCaptaGDP"]=None
        l_aux = list(df_gdp.loc[df_pisa["CNT1"]]["Per capita GDP"].values)
        df_pisa["perCaptaGDP"] = l_aux

        return df_pisa, df_gdp

