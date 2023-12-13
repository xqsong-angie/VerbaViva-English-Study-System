from flask import Flask, request, jsonify
import pandas as pd
import math
import openpyxl
from flask_cors import CORS
from urllib.parse import unquote
import logging
import json
import fcntl

app = Flask(__name__)


logging.basicConfig(filename='/home/AngieSong/mysite/record.log', level=logging.DEBUG)

@app.route('/')
def main():
  # showing different logging levels
  app.logger.debug("debug log info")
  app.logger.info("Info log information")
  app.logger.warning("Warning log info")
  app.logger.error("Error log info")
  app.logger.critical("Critical log info")
  return "testing logging levels."


#get next file
@app.route('/api/get_next', methods=['POST'])
def get_next():
    sim_filepath='/home/AngieSong/mysite/similarities_table.xlsx'

    #get parameters needed
    fileName = unquote(request.json.get("fileName").strip())
    rating = int(request.json.get("ratings")[-1])

    # read similarity from similarity matrix in excel
    with open(sim_filepath,'r')as file:
        fcntl.flock(file,fcntl.LOCK_SH)

        df_all = pd.read_excel(sim_filepath)
        df = pd.read_excel(sim_filepath, index_col='Scene')
        target_row= list(df.loc[fileName])
        filtered_list = [item for item in target_row if not math.isnan(item)]
        sorted_list = sorted(filtered_list, reverse=True)

        #4-5
        max_value = sorted_list[0]
        max_index = target_row.index(max_value)
        #3
        value_12th = sorted_list[11]
        index_12th = target_row.index(value_12th)
        #2
        value_17th = sorted_list[16]
        index_17th = target_row.index(value_17th)
        #1
        min_value = sorted_list[-1]
        min_index = target_row.index(min_value)

        fcntl.flock(file,fcntl.LOCK_UN)

        # recommend based on rating
        if rating == 1:
            # least similar
            next_file = df_all['Scene'][min_index]
        elif rating == 2:
            # 17th similar
            next_file = df_all['Scene'][index_17th]
        elif rating == 3:
            # 12th similar
            next_file = df_all['Scene'][index_12th]
        elif rating >= 4:
            # most similar
            next_file = df_all['Scene'][max_index]
    #next file
    return jsonify({'next_text': next_file})

#save rating list
@app.route('/api/save_rating', methods=['POST'])
def save_rating():
    try:
        ratingpath='/home/AngieSong/mysite/rating.xlsx'
        #load parameters needed
        ratings = request.json.get("ratings")
        app.logger.info("Type of ratings: %s", type(ratings))
        app.logger.info("Ratings: %s", ratings)

        username=request.args.get("user")
        app.logger.info('typeof username: %s', type(username))
        app.logger.info('Username: %s', username)

        with open(ratingpath,'a') as file:
            fcntl.flock(file,fcntl.LOCK_EX)
            #write to corresponding user row
            workbook = openpyxl.load_workbook(ratingpath)
            sheet = workbook['sheet1']
            start_row = int(username.split('user')[-1])+1
            app.logger.info('Start Row: %s', start_row)
            app.logger.info('type of Start Row: %s', type(start_row))

            start_col = 2
            for i, item in enumerate(ratings):
                sheet.cell(row=start_row, column=start_col + i).value=int(item)
            workbook.save(ratingpath)
            workbook.close()

            fcntl.flock(file,fcntl.LOCK_UN)

        return 'successful data saving', 200
    except Exception as e:
        # Log the error
        app.logger.error("An error occurred: %s", e)
        # Optionally, you can return an error response
        return f"Error: {e}", 500

if __name__ == '__main__':
    app.run()