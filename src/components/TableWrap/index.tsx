import { Pagination, Row, Table } from 'antd';

export interface ITableWrapProps<T> {
  className?: string;
  data?: T[];
  isLoading?: boolean;
  page?: number;
  size?: number;
  total?: number;
  children?: any;
  rowKey?: string;
  setSize?: (size: number) => void;
  setPage?: (page: number) => void;
  showPagination: boolean;
}

function TableWrap<T extends object>(props: ITableWrapProps<T>) {
  return (
    <>
      <Table
        className={props.className}
        dataSource={props.data}
        loading={props.isLoading}
        pagination={false}
        rowKey={props.rowKey || 'id'}
        bordered
      >
        {props.children}
      </Table>
      {props.showPagination && (
        <Row className="d-flex justify-content-center mt-3">
          <Pagination
            className="custom-pagination"
            pageSize={props.size}
            current={props.page}
            total={props.total}
            onShowSizeChange={(current, size) => props.setSize && props.setSize(size)}
            onChange={(page) => props.setPage && props.setPage(page)}
          />
        </Row>
      )}
    </>
  );
}

export default TableWrap;
