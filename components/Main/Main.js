'use client';
import { useReducer, useState, useEffect, useContext } from 'react';
import classes from './Main.module.css';
import ButtonsWrapper from '../ButtonsWrapper/ButtonsWrapper';
import Search from '../Search/Search';
import Form from '../Form/Form';
import Modal from '../Modal/Modal';
import Table from '../UI/Table/Table';
import Spinner from '../UI/Spinner/Spinner';
import Pagination from '../UI/Pagination/Pagination';
import Print from '../Print/Print';
import logbookReducer from '@/reducer/logbookReducer';
import { getAllLogs, createNewRow, updateLog } from '@/lib/logbook';
import {
  getLogbookFromStorage,
  saveLogbookToStorage,
  getDefaultLogbookData,
  formatDate,
  getTableColumnsAsChecks,
  stripSecondsFromTime,
  addMorePrintInfo,
} from '@/utils/helpers';
import {
  getMaxPageNum,
  getPageData,
  sanitizeData,
} from '@/utils/logbookHelpers';
import { logout } from '@/lib/user';
import { printContent } from '@/utils/print';
import { SearchContext } from '@/reducer/searchReducer';

export default function Main(props) {
  const dataFromStorage = getLogbookFromStorage();
  const [logbook, dispatch] = useReducer(logbookReducer, dataFromStorage || []);
  const [currentLogbook, setCurrentLogbook] = useState(getDefaultLogbookData());
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [dataForPage, setDataForPage] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrint, setShowPrint] = useState(false);
  const [fields, setFields] = useState(getTableColumnsAsChecks() || {});
  const searchParams = useContext(SearchContext);

  useEffect(() => {
    if (logbook.length > 0) {
      // console.log('KAKO NIJE BRE????', logbook);
      const maxPage = getMaxPageNum(logbook);
      setPageNum(maxPage);
      setMaxPage(maxPage);
      const dataForCurrentPage = getPageData(maxPage, logbook);
      setDataForPage(dataForCurrentPage);
    }
  }, [logbook]);

  useEffect(() => {
    setIsMounted(true); // debilana
  }, []);

  useEffect(() => {
    if (!dataFromStorage) {
      // console.log('FETCH DATA FROM SERVER!!!');
      refreshData();
    } else {
      setLogbookData(dataFromStorage);
    }
  }, []);

  const setLogbookData = (data) => {
    dispatch({ type: 'SET_LOGBOOK_DATA', data });
    setIsLoading(false);
  };

  const saveLogbook = (data) => {
    closeForm();
    // console.log('CALL API AND SAVE RECORD TO DB!', data);
    if (isEditMode) {
      // console.log('UPDATE RECORD');
      updateExistingRecord(data);
    } else {
      // console.log('INSERT RECORD');
      insertNewRecord(data);
    }
  };

  const insertNewRecord = async (data) => {
    setIsLoading(true);
    const preparedData = sanitizeData(data);
    // console.log(preparedData);
    try {
      const res = await createNewRow(preparedData);
      const newLogbook = [...logbook, ...res];
      setLogbookData(newLogbook);
      // console.log('INSERT SUCCESS!', res);
    } catch (err) {
      console.log('INSERT ERROR !!!', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateExistingRecord = async (data) => {
    setIsLoading(true);
    const preparedData = sanitizeData(data);
    const { id } = preparedData;
    delete preparedData.id;

    try {
      const res = await updateLog(id, preparedData);
      const newLogbook = [...logbook].map((log) =>
        log.id === id ? res[0] : log
      );
      setLogbookData(newLogbook);
    } catch (err) {
      console.log('UPDATE ERROR!!', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openForm = (isEdit = false) => {
    if (!isEdit) {
      const newData = getDefaultLogbookData();
      newData.date = formatDate(new Date());
      newData.page_num = pageNum;
      setCurrentLogbook(newData);
    }

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditMode(false);
  };

  const toggleSearch = () => {
    if (showSearch) {
      setIsSearchMode(false);
    }
    setShowSearch(!showSearch);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLogs();
      const preparedData = stripSecondsFromTime(data);
      setLogbookData(preparedData);
      saveLogbookToStorage(preparedData);
    } catch (err) {
      console.log('CANNOT GET RECORDS>>>', err);
    } finally {
      setIsLoading(false);
    }
  };

  const executeSearch = (data) => {
    setIsSearchMode(true);
    setSearchData(data);
  };

  const onEditRecord = (data) => {
    // console.log('EDIT DATA', data);
    setIsEditMode(true);
    setCurrentLogbook(data);
    openForm(true);
  };

  const logoutUser = async () => {
    logout();
  };

  const printDialog = () => {
    setShowPrint(true);
  };

  const closePrintDialog = () => {
    setShowPrint(false);
  };

  const updateFields = (e) => {
    const oldFields = [...fields];
    oldFields.forEach((field) => {
      if (field.key === e.target.name) {
        field.checked = !field.checked;
      }
    });
    setFields(oldFields);
  };

  const executePrint = () => {
    closePrintDialog();
    printContent(fields, addMorePrintInfo(searchParams, pageNum));
  };

  const goToFirstPage = () => {
    setPageNum(1);
    const pageData = getPageData(1, logbook);
    setDataForPage(pageData);
  };

  const goToPreviousPage = () => {
    const page = pageNum - 1;
    setPageNum(page);
    const pageData = getPageData(page, logbook);
    setDataForPage(pageData);
  };

  const goToNextPage = () => {
    const page = pageNum + 1;
    setPageNum(page);
    const pageData = getPageData(page, logbook);
    setDataForPage(pageData);
  };

  const goToLastPage = () => {
    setPageNum(maxPage);
    const pageData = getPageData(maxPage, logbook);
    setDataForPage(pageData);
  };

  const renderMainContent = () => {
    if (isMounted) {
      return (
        <>
          <ButtonsWrapper
            openForm={openForm}
            refreshData={refreshData}
            toggleSearch={toggleSearch}
            searchButtonText={showSearch ? 'HIDE SEARCH' : 'SHOW SEARCH'}
            logoutUser={logoutUser}
            printDialog={printDialog}
          />
          {showForm && (
            <Modal>
              <Form
                closeForm={closeForm}
                currentLogbook={currentLogbook}
                setLogbookData={setCurrentLogbook}
                saveLogbook={saveLogbook}
              />
            </Modal>
          )}
          {showSearch && (
            <Search
              logbook={logbook}
              setIsSearchMode={setIsSearchMode}
              executeSearch={executeSearch}
            />
          )}
          <Table
            dataForPage={isSearchMode ? searchData : dataForPage}
            logbook={logbook}
            onEditRecord={onEditRecord}
            pageNum={pageNum}
            isSearchMode={isSearchMode}
          />
          {!isSearchMode && (
            <Pagination
              pageNum={pageNum}
              maxPage={maxPage}
              goToFirstPage={goToFirstPage}
              goToPreviousPage={goToPreviousPage}
              goToNextPage={goToNextPage}
              goToLastPage={goToLastPage}
            />
          )}
          {showPrint && (
            <Modal>
              <Print
                executePrint={executePrint}
                closePrintDialog={closePrintDialog}
                updateFields={updateFields}
                fields={fields}
              />
            </Modal>
          )}
        </>
      );
    } else {
      return null;
    }
  };

  const styles = ['flex-column', 'flex-center', classes.Main].join(' ');

  // console.log('MAIN RENDER::::', searchParams);
  return (
    <div className={styles}>
      {!isLoading ? renderMainContent() : <Spinner />}
    </div>
  );
}
